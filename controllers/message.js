const jwt = require("jsonwebtoken");
const messageService = require("../services/message");
const registerModel = require("../models/register");
const key = process.env.JWT_SECRET;

const addMessage = async (req, res) => {

    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        try {
            const decoded = jwt.verify(token, key);

            // Find the user with the decoded username.
            const user = await registerModel.findOne({username: decoded.username});

            // Use the user's _id as the sender.
            const messageData = {
                sender: user._id,
                content: req.body.msg
            };

            const message = await messageService.addMessage(req.params.id, messageData);

            if (message) {
                res.status(200).json({
                    'id' : message._id,
                    'created' : message.created,
                    'sender' : {
                        'username' : user.username,
                        'displayName' : user.displayName,
                        'profilePic' : user.profilePic
                    },
                    content: message.content
                });
            } else {
                res.status(404).send('Message not added!');
            }
        } catch (err) {
            return res.status(401).send("Invalid Token");
        }
    } else {
        return res.status(403).send('Token required');
    }
};

const getMessages = async (req, res) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        try {
            jwt.verify(token, key);
            const messages = await messageService.getMessages(req.params.id);
            if (messages) {
                // Format the messages
                const formattedMessages = messages.map(message => ({
                    id: message._id,
                    created: message.created,
                    sender: {
                        username: message.sender.username,
                    },
                    content: message.content
                }));
                res.status(200).json(formattedMessages);
            } else {
                res.status(404).send('Messages not found!');
            }
        } catch (err) {
            return res.status(401).send("Invalid Token");
        }
    } else {
        return res.status(403).send('Token required');
    }
};

module.exports = {addMessage, getMessages}