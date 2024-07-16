const { Server } = require("socket.io");

let io;

function initialize(server) {
  io = new Server(server, {
    cors: {
      origin: "https://capable-truffle-9dc1c2.netlify.app", // Allow your frontend origin
      methods: ["GET", "POST"]
    }
  });
  
  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join', (userId) => {
      console.log(`User with ID ${userId} joined`);
      socket.join(userId); // Join room named after user ID
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
}

function getIo() {
  if (!io) {
    throw new Error("Socket.io is not initialized!");
  }
  return io;
}

module.exports = { initialize, getIo };
