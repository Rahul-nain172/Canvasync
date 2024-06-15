import React, { useEffect, useState } from 'react'
import socket from '../../config/socket'
import { useNavigate ,useParams} from 'react-router-dom';
import {  useDispatch } from 'react-redux';
import { setRoomId } from '../redux/room/roomSlice';
import { toast } from 'react-toastify';
export default function JoinRoom() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params=useParams();
    useEffect(()=>{
    if(!params){
        navigate('/');
    }},[]);
    const [userName, setuserName] = useState('');
    const joinRoom = (event) => {
        event.preventDefault();
        if(userName===''){
            toast.error('Enter username');
            return;
        }
        socket.emit('checkRoom', params.roomId, (response) => {
            if (response) {
                socket.emit('joinRequest', params.roomId, userName);
                setuserName('');
            }
            else {
                toast.error('Room Not found');
            }
        });
    }
    useEffect(() => {
        const handleJoined=(roomId,failed)=>{
            alert(roomId);
            if (failed) {
                alert('Room is Full');
            } else {
                dispatch(setRoomId(roomId));
                navigate(`/canvas/${roomId}`);
            }
        }
        socket.on('joined',handleJoined);
        return()=>{
            socket.off('joined', handleJoined);
        }
    },[dispatch,navigate])
    return (
        <div className='flex flex-col justify-center items-center bg-gradient-to-r from-blue-500 to-indigo-500 w-screen h-screen'>
          <h1 className='text-3xl font-semibold text-white mb-8'>Welcome to WhiteBoard</h1>
          <div className='flex flex-col justify-center items-center gap-4 bg-white bg-opacity-90 p-8 rounded-lg shadow-lg'>
            <label htmlFor='name' className='font-medium text-lg text-gray-800'>Enter Your Name</label>
            <input
              id='name'
              type='text'
              placeholder=''
              value={userName}
              onChange={(e) => setuserName(e.target.value)}
              className='h-12 px-4 w-full max-w-md rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
            <button
              className='h-12 mt-4 px-6 w-full max-w-md rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
              onClick={joinRoom}
            >
              Join Room
            </button>
          </div>
        </div>
      );
}
