const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },
    photo: { type: String, required: true },
    is_deleted: { type: Boolean, default: false },
    description: { type: String },
    address: { type: String },
    liked_user_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],
    comments: [{
        text: { type: String },
        sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
        sender_photo: { type: String },
        sender_username: { type: String },
        created_at: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;