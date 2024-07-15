// webSocketServer.js
const { Server } = require('socket.io');

function initialize(server) {
  const io = new Server(server, {
    cors: {
      origin: 'https://capable-truffle-9dc1c2.netlify.app',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId; // Assume user ID is sent as query parameter
    socket.join(userId); // Join room named after user ID
    console.log(`User connected: ${userId}`);

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${userId}`);
    });
  });

  return io;
}

module.exports = { initialize };
