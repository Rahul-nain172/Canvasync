import {io,Socket} from 'socket.io-client';

const socket=io('https://vercel.com/rahul-nain172s-projects/whiteboard-app/5ehkBrWVBkjYzs8KjQW32jDEAuNS/');
socket.on('connect', () => {
});
export default socket;