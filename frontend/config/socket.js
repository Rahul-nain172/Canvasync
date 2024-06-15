import {io,Socket} from 'socket.io-client';


const ENDPOINT = 'https://whiteboard-ccmjnq2tl-rahul-nain172s-projects.vercel.app';
const socket=io(ENDPOINT,{
    withCredentials: true,
    transports: ['websocket','polling'],
});
socket.on('connect', () => {
});
export default socket;