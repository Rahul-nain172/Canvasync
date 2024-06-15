import {io,Socket} from 'socket.io-client';

const socket=io('https://whiteboard-dhhob5omn-rahul-nain172s-projects.vercel.app/');
socket.on('connect', () => {
});
export default socket;