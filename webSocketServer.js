const { Server } = require("socket.io");

let io;

const initializeWebSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ["https://capable-truffle-9dc1c2.netlify.app"],
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId; // Get userId from query parameters
        socket.join(userId); // Join the room for this user

        console.log(`User ${userId} connected and joined room`);



        socket.on('disconnect', () => {
            console.log(`User ${userId} disconnected`);
        });

        socket.on('rentalCompleted', (data) => {
          // const { room, message } = data;
          io.to(userId).emit('rentalCompleted', data);
      });
  
    });

    return io;
};

const getIo = () => {
    if (!io) {
        throw new Error("WebSocket not initialized. Please call initializeWebSocket first.");
    }
    return io;
};

module.exports = { initializeWebSocket, getIo };
