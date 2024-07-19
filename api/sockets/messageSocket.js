module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected for chat');

        socket.on('sendMessage', (message) => {
            io.emit('receiveMessage', message); // Broadcast the message to all connected clients
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected from chat');
        });
    });
};
