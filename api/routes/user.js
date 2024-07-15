const express = require('express');
const User = require('../models/user');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/allUser', async (req, res) => {
  try {
    const usersWithProfiles = await User.aggregate([
      {
        $lookup: {
          from: 'profiles',
          localField: '_id',
          foreignField: 'user_id',
          as: 'profile'
        }
      },
      {
        $unwind: '$profile'
      },
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          password: 1,
          'profile.profilePicture': 1,
          'profile.request_sent': 1,
          'profile.request_received': 1,
          'profile.friends': 1,
          'profile.createdAt': 1,
          'profile.updatedAt': 1
        }
      }
    ]);

    return res.status(200).json(usersWithProfiles);
  } catch (error) {
    console.error("Error fetching users with profiles", error);
    return res.status(500).json({ message: "Failed to fetch users with profiles" });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const userWithProfile = await User.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(userId)
        }
      },
      {
        $lookup: {
          from: 'profiles',
          localField: '_id',
          foreignField: 'user_id',
          as: 'profile'
        }
      },
      {
        $unwind: '$profile'
      },
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          password: 1,
          'profile.profilePicture': 1,
          'profile.request_sent': 1,
          'profile.request_received': 1,
          'profile.friends': 1,
          'profile.createdAt': 1,
          'profile.updatedAt': 1
        }
      }
    ]);

    if (!userWithProfile) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(userWithProfile);
  } catch (error) {
    console.error("Error fetching user with profile", error);
    return res.status(500).json({ message: "Failed to fetch user with profile" });
  }
});

module.exports = router;