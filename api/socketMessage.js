// socket.js
const socketIo = require('socket.io');

let io;

module.exports = {
    initializeSocket: (server) => {
        io = socketIo(server);

        // Dummy data for simplicity
        let activeUsers = {};

        io.on('connection', (socket) => {
            console.log('a user connected');

            socket.on('join', (userId) => {
                console.log('User joined:', userId);
                activeUsers[userId] = socket.id;
            });

            socket.on('disconnect', () => {
                console.log('user disconnected');
                // Handle disconnect and remove from active users
            });

            socket.on('send:message', ({ senderId, recipientId, text }) => {
                console.log('Message received:', { senderId, recipientId, text });
                const recipientSocketId = activeUsers[recipientId];
                if (recipientSocketId) {
                    socket.to(recipientSocketId).emit('receive:message', { senderId, text });
                } else {
                    console.log(`Recipient ${recipientId} not connected`);
                }
            });
        });

        return io;
    },

    getIO: () => {
        if (!io) {
            throw new Error('Socket.io not initialized!');
        }
        return io;
    }
};
