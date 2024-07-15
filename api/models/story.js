const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    is_deleted: { type: Boolean, default: false },
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    photo: { type: String, required: true },
    description: { type: String },
    address: { type: String },
    reacted_user: [{
        timestamps: { type: Date, default: Date.now },
        liked: { type: Boolean, default: false },
        sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }],
}, { timestamps: true });

const Story = mongoose.model('Story', storySchema);

module.exports = Story;