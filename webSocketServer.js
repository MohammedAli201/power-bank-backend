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
        const userId = socket.handshake.query.userId; // Assume user ID is sent as query parameter
        socket.join(userId); // Join room named after user ID
    });
}

function getIO() {
    if (!io) {
        throw new Error("Socket.io is not initialized!");
    }
    return io;
}

module.exports = { initialize, getIO };
