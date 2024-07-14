const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    is_deleted: { type: Boolean, default: false },
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
}, { timestamps: true });
const User = mongoose.model('User', userSchema);

module.exports = User;