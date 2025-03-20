module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected for chat');
        // console.log(`User ${socket.username || 'Anonymous'} connected for chat`);

        socket.on('sendMessage', (message) => {
            io.emit('receiveMessage', message);
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected from chat');
            // console.log(`User ${socket.username || 'Anonymous'} disconnected from chat`);
        });
    });
};
