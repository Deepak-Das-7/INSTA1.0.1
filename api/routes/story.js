const express = require('express');
const moment = require('moment');
const Story = require('../models/story');
const router = express.Router();

router.get('/', async (req, res) => {
    const twentyFourHoursAgo = moment().subtract(24, 'hours').toDate();
    try {
        const stories = await Story.find({ createdAt: { $gte: twentyFourHoursAgo } })
            .sort({ createdAt: -1 });

        if (!stories || stories.length === 0) {
            return res.status(404).json({ message: "No stories found in the last 24 hours" });
        }
        const uniqueStoriesMap = new Map();

        stories.forEach(story => {
            const ownerId = story.owner_id.toString();
            if (!uniqueStoriesMap.has(ownerId)) {
                uniqueStoriesMap.set(ownerId, story);
            }
        });

        const uniqueStories = Array.from(uniqueStoriesMap.values());

        return res.status(200).json(uniqueStories);
    } catch (error) {
        console.error("Error retrieving stories:", error);
        return res.status(500).json({ message: "Failed to retrieve stories" });
    }
});

router.post('/add', async (req, res) => {
    try {
        const newStory = new Story({
            owner_id: req.body.sender_id,
            description: req.body.description,
            photo: req.body.photo,
            address: req.body.address
        });
        const savedPost = await newStory.save();
        res.status(201).send(savedPost);
    } catch (error) {
        console.error('Error sending story and inserting into the database:', error);
        res.status(500).send('Internal server error');
    }
});


router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const story = await Story.findOne({ _id: id });
        if (!story) {
            console.log(story);
            return res.status(404).json({ message: "story not found" });
        }
        return res.status(200).json(story);
    } catch (error) {
        console.error("Error retrieving story", error);
        return res.status(500).json({ message: "Failed to retrieve the story" });
    }
});

router.post('/liked', async (req, res) => {
    try {
        const { story_id, reactor_id } = req.body;
        const story = await Story.findById(story_id);
        if (!story) {
            return res.status(404).json({ error: "Story not found" });
        }

        const reactedUser = story.reacted_user.find(user => user.sender_id.equals(reactor_id));

        if (reactedUser) {
            reactedUser.liked = true;
        } else {
            console.log(`User ${reactor_id} has not reacted to this story yet`);
        }

        const updatedStory = await story.save();
        res.status(200).json(updatedStory);
    } catch (error) {
        console.error('Error making request', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/seen', async (req, res) => {
    try {
        const { story_id, reactor_id } = req.body;
        const story = await Story.findById(story_id);
        if (!story) {
            return res.status(404).json({ error: "Story not found" });
        }

        const isAlreadySeen = story.reacted_user.some(user => user.sender_id.equals(reactor_id));
        if (!isAlreadySeen) {
            story.reacted_user.push({ sender_id: reactor_id });
        }
        else{
            console.log(`User ${reactor_id} has already seen this story`);
        }
        const updatedStory = await story.save();
        res.status(200).json(updatedStory);
    } catch (error) {
        console.error('Error making request', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = router;
