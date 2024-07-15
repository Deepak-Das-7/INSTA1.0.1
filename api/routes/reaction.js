const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('liked_user_id', 'username'); // Populate liked_user_id with username from Profile collection
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST route to handle post likes
router.post('/like', async (req, res) => {
  const { userId, username, postId } = req.body;

  try {
    // Update the post in MongoDB
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { liked_user_id: userId } }, // Adding userId to liked_user_id array
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Emit 'like' event to all clients via socket.io
    const likeData = {
      userId,
      username,
      postId,
      timestamp: new Date(),
    };
    req.app.io.emit('update', { type: 'like', data: likeData });

    res.status(200).json({ message: 'Post liked successfully' });
  } catch (error) {
    console.error('Error liking post:', error); // Log the error for debugging
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
