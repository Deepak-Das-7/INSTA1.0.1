const express = require('express');
const router = express.Router();

const story = require('./story');
const posts = require('./posts');
const profile = require('./profile');
const request = require('./request');
// const messages = require('./messageRoutes');
const auth = require('./auth');
const user = require('./user');
const reaction = require('./reaction');
const messageRoutes = require('./messageRoutes');

router.use('/story', story);
router.use('/posts', posts);
router.use('/profile', profile);
router.use('/request', request);
// router.use('/messages', messages);
router.use('/auth', auth);
router.use('/user', user);
router.use('/reaction', reaction);
router.use('/messages', messageRoutes);

module.exports = router;
