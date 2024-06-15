import {io,Socket} from 'socket.io-client';


const ENDPOINT = 'https://canvasync.onrender.com/';
const socket=io(ENDPOINT,{
    withCredentials: true,
    transports: ['websocket','polling'],
});
socket.on('connect', () => {
});
export default socket;