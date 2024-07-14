const express = require('express');
const Post = require('../models/post');
const Profile = require('../models/profile');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const post = await Post.find({ is_deleted: false }).sort({ createdAt: -1 });
        console.log("/posts");
        return res.status(200).json(post);
    } catch (error) {
        console.error("Error retrieving posts", error);
        return res.status(500).json({ message: "Failed to retrieve the posts" });
    }
});

router.get('/:id', async (req, res) => {

    try {
        const id = req.params.id;
        const post = await Post.findOne({ _id: id });
        if (!post) {
            return res.status(404).json({ message: "post not found" });
        }
        // console.log("/posts/:id");
        return res.status(200).json(post);
    } catch (error) {
        console.error("Error retrieving posts", error);
        return res.status(500).json({ message: "Failed to retrieve the posts" });
    }
});

router.post('/add', async (req, res) => {

    try {
        const newPost = new Post({
            owner_id: req.body.sender_id,
            description: req.body.description,
            address: req.body.address,
            photo: req.body.photo
        });
        const savedPost = await newPost.save();
        console.log("/posts/add");
        res.status(201).send(savedPost);
    } catch (error) {
        console.error('Error sending Post and inserting into the database:', error);
        res.status(500).send('Internal server error');
    }
});

router.post('/delete', async (req, res) => {
    try {
        const { post_id } = req.body;
        const post = await Post.findById(post_id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        post.is_deleted = true;
        const updatedPost = await post.save();
        res.json({ message: "Post deleted successfully", updatedPost });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/liked', async (req, res) => {
    try {
        const { post_id, senderId } = req.body;
        const post = await Post.findById(post_id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        const isLiked = post.liked_user_id.includes(senderId);
        if (isLiked) {
            post.liked_user_id = post.liked_user_id.filter(id => id.toString() !== senderId);
        } else {
            post.liked_user_id.push(senderId);
        }

        const updatedPost = await post.save();
        console.log("/posts/liked");
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error("Error liking post:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
router.post('/likedPresence', async (req, res) => {
    try {
        const { post_id, senderId } = req.body;

        // Find the post by ID
        const post = await Post.findById(post_id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Check if the senderId is in the liked_user_id array of the post
        const isLiked = post.liked_user_id.includes(senderId);

        // Return the result as a JSON response
        return res.status(200).json({ liked: isLiked });
    } catch (error) {
        console.error("Error checking like presence:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/comment', async (req, res) => {
    try {
        const { post_id, senderId, text } = req.body;
        const post = await Post.findById(post_id);
        const sender = await Profile.findOne({ user_id: senderId });


        if (!post || !sender) {
            return res.status(404).json({ error: "Post not found" });
        }
        post.comments.push({ text, sender_id: senderId, sender_username: sender.username, sender_photo: sender.profilePicture });
        const updatedPost = await post.save();
        console.log("/posts/comment");

        res.status(200).json(updatedPost);
    } catch (error) {
        console.error("Error adding comment to post:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


module.exports = router;
