import {io,Socket} from 'socket.io-client';

const socket=io('https://whiteboard-ce6v726a2-rahul-nain172s-projects.vercel.app/');
socket.on('connect', () => {
});
export default socket;