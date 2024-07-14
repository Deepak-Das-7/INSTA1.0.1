const express = require('express');
const Profile = require('../models/profile');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { user_id, username, email, photo } = req.body;
        if (!user_id) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const existingProfile = await Profile.findOne({ user_id: user_id });
        if (existingProfile) {
            existingProfile({ user_id: user_id, username: username, email: email, photo: photo, updatedAt: new Date() });
            await existingProfile.save();
        }
        else {
            return res.status(404).json({ message: "UserProfile does not exists" });
        }
        return res.status(201).json({ message: "Profile created successfully", profile: existingProfile });
    } catch (error) {
        console.error("Error creating profile", error);
        return res.status(500).json({ message: "Failed to create profile" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await Profile.findOne({ user_id: id });
        if (!user) {
            return res.status(404).json({ message: "Profile not found" });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error("Error retrieving profile", error);
        return res.status(500).json({ message: "Failed to retrieve the Profile" });
    }
});
router.get('/friends/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await Profile.findOne({ user_id: id }).populate('friends');
        if (!user) {
            return res.status(404).json({ message: "Profile not found" });
        }
        return res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error retrieving profile", error);
        return res.status(500).json({ message: "Failed to retrieve the Profile" });
    }
});
router.get('/allOthers/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const users = await Profile.find({ user_id: { $ne: id } });
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error retrieving users", error);
        return res.status(500).json({ message: "Failed to retrieve the users" });
    }
});


module.exports = router;