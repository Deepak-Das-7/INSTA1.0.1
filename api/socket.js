module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    // Example: Handle 'like' event
    socket.on('like', (data) => {
      const { userId, username, postId } = data;
      const likeData = {
        userId,
        username,
        postId,
        timestamp: new Date(),
      };
      io.emit('update', { type: 'like', data: likeData });
    });
  });
};
