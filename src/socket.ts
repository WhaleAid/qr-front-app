import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');

socket.on('connect', () => {
    console.log('Connected to socket.io server', socket.id);
});

socket.on('disconnect', (reason) => {
    console.log('Disconnected from socket.io server', reason);
});

socket.on('connect_error', (error) => {
    console.error('Connection error', error);
});

export { socket };
