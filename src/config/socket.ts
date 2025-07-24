import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

export function setupSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: [
        'https://ibiea.com',
        'http://localhost:5173'
      ],
      methods: ['GET', 'POST'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization']
    },
    transports: ['polling', 'websocket']
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.log('Connection error:', err);
    });
  });

  return io;
}