const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.post('/send', messageController.sendMessage);
router.get('/conversation', messageController.getConversation);
router.get('/seen', messageController.markMessagesAsSeen);

module.exports = router;
