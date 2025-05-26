import app from './app.js';
import { connectDb } from './db.js';
import http from 'http';
import { Server } from 'socket.io';

connectDb();

// Crea el servidor HTTP a partir de tu app de express
const server = http.createServer(app);

// Crea la instancia de Socket.IO y configúrala
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Cambia esto si tu frontend está en otro puerto/origen
    credentials: true
  }
});

// Ejemplo de conexión básica
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Haz io exportable si lo necesitas en controladores
export { io };

// Cambia app.listen por server.listen
server.listen(4000, () => {
  console.log('Server & Socket.IO on port 4000');
});