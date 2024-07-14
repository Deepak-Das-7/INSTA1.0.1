const express = require('express');
const Story = require('../models/story');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const story = await Story.find({});
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
router.post('/add', async (req, res) => {
    try {
        const newStory = new Story({
            owner_id: req.body.sender_id,
            description: req.body.description,
            photo: req.body.photo
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
        const story = await Story.findOne({ owner_id: id });
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
///THIS NEEDS TO BE WORKED CORRECTLLY

router.post('/react', async (req, res) => {
    try {
        const { story_id, reactor_id, request, text } = req.body;
        const story = await Story.findById(story_id);
        if (!story) {
            return res.status(404).json({ error: "Story not found" });
        }
        if (request === "like") {
            story.liked_user_id.push(reactor_id);
        } else if (request === "reaction") {
            story.reaction.push({ text, sender_id: reactor_id });
        } else {
            console.log("Attempted wrong request for story");
            return res.status(400).json({ error: 'Invalid request' });
        }
        const updatedStory = await story.save();
        console.log("Reaction saved successfully");
        res.status(200).json(updatedStory);
    } catch (error) {
        console.error('Error making request', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = router;
