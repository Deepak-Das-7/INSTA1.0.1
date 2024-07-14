const express = require('express');
const Profile = require('../models/profile');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const myId = req.query.senderId;
        const yourId = req.query.receiverId;
        const request = req.query.kisme;

        if (request === "Accept Request") {

            const myProfile = await Profile.findOneAndUpdate(
                { user_id: myId },
                { $addToSet: { friends: yourId } },
                { new: true }
            );

            const yourProfile = await Profile.findOneAndUpdate(
                { user_id: yourId },
                { $addToSet: { friends: myId } },
                { new: true }
            );

            const removeRequestFromMyList = await Profile.findOneAndUpdate(
                { user_id: myId },
                { $pull: { request_received: yourId } },
                { new: true }
            );

            const removeRequestFromYourList = await Profile.findOneAndUpdate(
                { user_id: yourId },
                { $pull: { request_sent: myId } },
                { new: true }
            );


            if (myProfile && yourProfile && removeRequestFromMyList && removeRequestFromYourList) {
                res.status(200).send('Friend request accepted/sent successfully');
            } else {
                res.status(404).send('Error accepting friend request');
            }
        }
        else if (request === "Add Friend") {
            // console.log("Sending requestssssssssssssssssss");
            const myProfile = await Profile.findOneAndUpdate(
                { user_id: myId },
                { $addToSet: { request_sent: yourId } },
                { new: true }
            );

            const yourProfile = await Profile.findOneAndUpdate(
                { user_id: yourId },
                { $addToSet: { request_received: myId } },
                { new: true }
            );
            if (myProfile && yourProfile) {
                // console.log("Sending friend request from", myId, "to", yourId);
                res.status(200).send('Friend request sent successfully');
            } else {
                res.status(404).send('Error sending friend request');
            }
        }
        else {
            console.log("ATTEMPTED WRONG REQUEST", myId, yourId, request, "Hello");
            res.status(400).send('Invalid request');
        }

    } catch (error) {
        console.error('Error making request', error);
        res.status(500).send('Internal server error');
    }

});



module.exports = router;
