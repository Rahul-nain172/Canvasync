import React, { useEffect, useState } from 'react';
import socket from '../../config/socket';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setRoomId } from '../redux/room/roomSlice';

export default function Form() {
    const dispatch = useDispatch();
    const navigate = useNavigate();   
    const CreateRoom = (event) => {
        event.preventDefault();
        if(userName===''){
            toast.error('Enter username');
            return;
        }
        socket.emit('createRoom', userName);
        setuserName('');
    };
    const joinRoom = (event) => {
        event.preventDefault();
        if(userName===''){
            toast.error('Enter username');
            return;
        }
        if(room===''){
            toast.error('Enter room no');
            return;
        }
        socket.emit('checkRoom', room, (response) => {
            if (response) {
                socket.emit('joinRequest', room, userName);
                setuserName('');
            } else {
                toast.error('Room not found')
            }
        });
        setroom('');
    };
    useEffect(() => {
        const handleCreated = (roomId) => {
            dispatch(setRoomId(roomId));
            navigate(`/canvas/${roomId}`);
        };
        const handleJoined = (roomId, failed) => {
            if (failed) {
                toast.error('Room is full');
            } else {
                dispatch(setRoomId(roomId));
                navigate(`/canvas/${roomId}`);
            }
        };
        socket.on('created', handleCreated);
        socket.on('joined', handleJoined);
        return () => {
            socket.off('created', handleCreated);
            socket.off('joined', handleJoined);
        };
    }, [dispatch, navigate]);

    const [userName, setuserName] = useState('');
    const [room, setroom] = useState('');

    return (
        <div className='flex flex-col justify-center items-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-screen h-screen'>
            <h1 className='text-5xl font-bold text-white mb-8 drop-shadow-lg'>Welcome to CanvaSync</h1>
            <div className='flex flex-col justify-center items-center gap-6 bg-white p-8 rounded-lg shadow-2xl w-96'>
                <div className='flex flex-col w-full'>
                    <label htmlFor='name' className='font-medium text-lg mb-2 text-gray-700'>Enter Your Name</label>
                    <input 
                        id='name' 
                        type="text" 
                        value={userName} 
                        onChange={(e) => setuserName(e.target.value)} 
                        className='h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out' 
                        placeholder='Your name'
                    />
                    <button 
                        className='h-12 mt-4 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition duration-300 ease-in-out shadow-md hover:shadow-lg' 
                        onClick={CreateRoom}
                    >
                        Create Room
                    </button>
                </div>

                <h2 className='text-xl font-medium mt-4 text-gray-700'>OR</h2>

                <div className='flex flex-col w-full'>
                    <label htmlFor='roomid' className='font-medium text-lg mb-2 text-gray-700'>Enter Room ID</label>
                    <input 
                        id='roomid' 
                        type="text" 
                        value={room} 
                        onChange={(e) => setroom(e.target.value)} 
                        className='h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 ease-in-out' 
                        placeholder='Room ID'
                    />
                    <button 
                        className='h-12 mt-4 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition duration-300 ease-in-out shadow-md hover:shadow-lg' 
                        onClick={joinRoom}
                    >
                        Join Room
                    </button>
                </div>
            </div>
        </div>
    );
}
