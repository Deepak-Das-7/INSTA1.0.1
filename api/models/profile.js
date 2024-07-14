const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    is_deleted: { type: Boolean, default: false },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String },
    email: { type: String, unique: true },
    profilePicture: { type: String },
    request_sent: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    request_received: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }]

}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;