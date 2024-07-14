const socketIo = require('socket.io');

let io;

function initialize(server) {
  io = socketIo(server, {
    cors: {
      origin: '*', // Adjust as needed
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return io;
}

function getIo() {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
}

module.exports = { initialize, getIo };
