import express from 'express';
import http, { get } from 'http'
import cors from 'cors';
import { customAlphabet } from 'nanoid';
import { Server } from 'socket.io';
import { join } from 'path';
import { v4 } from "uuid";
const port=process.env.PORT||4000;
const generateRoomId = customAlphabet('1234567890', 4);

const app=express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  }));
  
  

const server=http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true, 
    }
  });
  


const rooms=new Map();
const addMove = (roomId,socketId,move) => {
    const room = rooms.get(roomId);
    if(!room)return;
    if (!room.users.has(socketId)) {
      room.usersMoves.set(socketId, [move]);
    }

    room.usersMoves.get(socketId).push(move);
  };

    io.on('connection',(socket)=>{

    const getRoomId = () => {
        const joinedRoom = [...socket.rooms].find(room => room !== socket.id);
        return joinedRoom;
    }
    

    socket.on('createRoom', (userName) => {//when user creates the room
        const roomId = generateRoomId();
        socket.join(roomId);
        // Initialize the room object with the correct structure
        const room = {
            usersMoves: new Map(),
            drawn: [],
            users: new Map()
        };
    
        // Set initial values for the room
        room.usersMoves.set(socket.id, []);
        room.users.set(socket.id, userName);
    
        // Store the room object in the rooms map
        rooms.set(roomId, room);
        io.to(socket.id).emit("created", roomId);
    });
    socket.on("checkRoom", (roomId,callback) => { //when user checks for a room
        if (rooms.has(roomId))callback(true);
        else callback(false);
      });
    socket.on('joinRequest',(roomId,userName)=>{ //when user know their exists a room and he wanna join it
        const room = rooms.get(roomId);
        if(room&&room.users.size<10){
            socket.join(roomId);//user joined the room
            room.users.set(socket.id,userName);
            room.usersMoves.set(socket.id,[]);
            io.to(socket.id).emit("joined",roomId,false)
        }
        else{
            io.to(socket.id).emit("joined","",true)
        }
    })
    socket.on('joinedRoom',(callback)=>{
        const roomId=getRoomId();
        const room=rooms.get(roomId);
        if(!room){
            callback(false);
            return;
        }
        io.to(socket.id).emit("yourRoominfo",room,[...room.usersMoves],[...room.users]);
        const userName=room.users.get(socket.id)||"Anonymous";
        socket.broadcast.to(roomId).emit("newUser",socket.id,userName);
        callback(true);
    });
    socket.on("mouseMove", (x, y,shape,move) => { //when user moves hi mouse
        socket.broadcast.to(getRoomId()).emit("mouseMoved", x, y,shape,move, socket.id);
    });
    socket.on("sendMessage", (message) => { //when user sends a group message
        const roomId=getRoomId();
        const room=rooms.get(roomId);
        if(!room)return;
        const userName=room.users.get(socket.id);
        socket.broadcast.to(getRoomId()).emit("newMessage",socket.id,userName);
      });
    socket.on("draw", (move) => {
        const roomId = getRoomId();
  
        const timestamp = Date.now();
        move.id = v4();
        addMove(roomId, socket.id, { ...move, timestamp });
  
        io.to(socket.id).emit("your_move", { ...move, timestamp });
  
        socket.broadcast
          .to(roomId)
          .emit("user_draw", { ...move, timestamp }, socket.id);
      });
      socket.on('leaveRoom',()=>{  //when user leave
        const roomId=getRoomId();

        const room =rooms.get(roomId);
        if(!room)return;
        const userMoves=room.usersMoves.get(socket.id);
        const userName=room.users.get(socket.id);
        if(userMoves){
            room.drawn.push(...userMoves);
        }
        room.users.delete(socket.id);
        socket.leave(roomId);
        io.to(roomId).emit('userDisconnected',socket.id,userName);
    })
    socket.on('undo',()=>{
        const roomId=getRoomId();
        const room = rooms.get(roomId);
        if(!room)return;
        room.usersMoves.get(socket.id).pop();
        socket.broadcast.to(roomId).emit("user_undo", socket.id);
    })
    //for undo redo



    socket.on('disconnecting',()=>{ // when user gets disconnected
        const roomId=getRoomId();
        const room =rooms.get(roomId);
        if(!room)return;
        const userName=room.users.get(socket.id);
        const userMoves=room.usersMoves.get(socket.id);
        if(userMoves){
            room.drawn.push(...userMoves);
        }
        room.users.delete(socket.id);
        socket.leave(roomId);
        io.to(roomId).emit('userDisconnected',socket.id,userName);
    })

    
})
app.get('/socket.io', (req, res) => {
    res.send('Hello from socket.io route!');
  });
server.listen(port,()=>{
    console.log(`server is running at port ${3000}`);
});

