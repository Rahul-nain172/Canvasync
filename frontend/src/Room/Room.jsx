import React, { useRef, useEffect } from 'react';
import RoomContextProvider from '../contexts/roomContext.jsx';
import Canvas from './Canvas.jsx';
import socket from '../../config/socket.js';
import { useDispatch } from 'react-redux';
import { addUser, removeUser, addMoveWithoutUser,setMovetoUser } from '../redux/room/roomSlice.js';
import Mouse from './Mouse.jsx';
import RenderMouses from './RenderMouses.jsx';
import Image from '../Image.jsx';
import SelectionButtons from './SelectionButtons.jsx';
import WriteText from './WriteText.jsx';
import Users from './Users.jsx';
import { toast } from 'react-toastify';
export default function Room() {
  const dispatch = useDispatch();
  useEffect(() => {
    const addRoomInfo = (room, usersMoves, users) => {
      const receivedUsers = new Map(users);
      const receivedUsersMoves = new Map(usersMoves);
      receivedUsers.forEach((name, userId) => {
        if (userId === socket.id) return;
        dispatch(addUser({ name, userId }));
      });
      dispatch(setMovetoUser(receivedUsersMoves));
      dispatch(addMoveWithoutUser(room.drawn));
    };
  
    const updateNewUser = (userId, name) => {
      toast.info(`${name} joined the room`);
      dispatch(addUser({ userId, name }));
    };
  
    const disconnectUser = (userId, name) => {
      toast.info(`${name} left the room`);
      dispatch(removeUser(userId));
    };
  
    socket.on('yourRoominfo', addRoomInfo);
    socket.on('newUser', updateNewUser);
    socket.on('userDisconnected', disconnectUser);
  
    // Cleanup function
    return () => {
      socket.off('yourRoominfo', addRoomInfo);
      socket.off('newUser', updateNewUser);
      socket.off('userDisconnected', disconnectUser);
    };
  }, [dispatch]); // Ensure dependencies are correct here
  

  return (
    <RoomContextProvider>
      <div className="relative flex flex-1 overflow-hidden ">
        <Canvas />
        <Mouse/>
        <RenderMouses/>
        <SelectionButtons/>
        <WriteText/>
        <Image/>
        <Users/>
      </div>
    </RoomContextProvider>
  );
}
