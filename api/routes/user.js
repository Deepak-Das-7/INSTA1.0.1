const express = require('express');
const User = require('../models/user');
const router = express.Router();

router.get('/allUser', async (req, res) => {
    try {
        const users = await User.find({});
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users", error);
        return res.status(500).json({ message: "Failed to fetch users" });
    }
});


module.exports = router;