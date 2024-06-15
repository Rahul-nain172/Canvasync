import {io,Socket} from 'socket.io-client';

const socket=io('https://whiteboard-hdk271mqk-rahul-nain172s-projects.vercel.app/');
socket.on('connect', () => {
});
export default socket;