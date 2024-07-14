const mongoose = require('mongoose');

const messagesSchema = new mongoose.Schema({
    is_deleted: { type: Boolean, default: false },
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receipent_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    viewed: { type: Boolean, required: true },
    viewedAt: { type: Date },
}, { timestamps: true });

const Messages = mongoose.model('message', messagesSchema);
module.exports = Messages;