const likeSocket = require('./like');
const messageSocket = require('./messageSocket');

module.exports = (io) => {
    likeSocket(io);
    messageSocket(io);
};
