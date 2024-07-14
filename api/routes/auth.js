const express = require('express');
const User = require('../models/user');
const Profile = require('../models/profile');
const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (password === existingUser.password) {
                const existingUser2 = await Profile.findOne({ email });
                return res.status(201).json({
                    data: existingUser2,
                    message: "User logged in successfully"
                });
            }
            else {
                return res.status(409).json({ message: "Invalid password" });
            }
        }
        else {
            return res.status(409).json({ message: "User does not exists" });
        }
    } catch (error) {
        console.error("Error login user", error);
        return res.status(500).json({ message: "Failed to add a user" });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { username, email, password, profilePicture } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        const newUser = new User({ username, email, password });
        await newUser.save();
        //PROFILE TABLE UPDATE
        const currentUser = await User.findOne({ email });
        if (currentUser) {
            const newProfile = new Profile({ user_id: currentUser._id, username: username, email: email, profilePicture: profilePicture });
            await newProfile.save();
        }
        return res.status(201).json({ message: "User saved successfully", user: newUser });
    } catch (error) {
        console.error("Error registering user", error);
        return res.status(500).json({ message: "Failed to add a user" });
    }
});

module.exports = router;
