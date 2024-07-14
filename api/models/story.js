const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    is_deleted: { type: Boolean, default: false },
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    photo: { type: String, required: true },
    description: { type: String },
    liked_user_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    reaction: [{
        text: { type: String },
        sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }]
}, { timestamps: true });

const Story = mongoose.model('Story', storySchema);

module.exports = Story;