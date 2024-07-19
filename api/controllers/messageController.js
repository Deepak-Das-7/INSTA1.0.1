const Messages = require('../models/messages');

exports.sendMessage = async (req, res) => {
    try {
        const { sender_id, receipent_id, text } = req.body;
        const savedMessage = await Messages.create({
            sender_id,
            receipent_id,
            text,
            viewed: false,
            viewedAt: null
        });
        
        // Emit the message to all connected clients
        req.app.io.emit('send:message', { sender_id, receipent_id, text });

        res.status(201).json(savedMessage);
    } catch (error) {
        console.error('Error sending message and inserting into the database:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getConversation = async (req, res) => {
    try {
        const { sender_id, receipent_id } = req.query;
        const conversation = await Messages.find({
            $or: [
                { sender_id: sender_id, receipent_id: receipent_id },
                { sender_id: receipent_id, receipent_id: sender_id }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(conversation);
    } catch (error) {
        console.error('Error fetching conversation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.markMessagesAsSeen = async (req, res) => {
    try {
        const { sender_id, receipent_id } = req.query;
        const conversation = await Messages.find({ sender_id, receipent_id }).sort({ createdAt: 1 });
        for (const message of conversation) {
            if (!message.viewed) {
                message.viewed = true;
                message.viewedAt = Date.now();
                await message.save();
            }
        }
        res.status(200).json({ message: 'Messages marked as viewed successfully' });
    } catch (error) {
        console.error('Error marking messages as viewed:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
