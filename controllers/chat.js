const jwt = require('jsonwebtoken');
const key = process.env.JWT_SECRET;

const chatService = require('../services/chat');
const messageModel = require('../models/message');
const registerModel = require('../models/register');
const chatModel = require('../models/chat');

const getChats = async (req, res) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];

        try {
            const decoded = jwt.verify(token, key);

            const user = await registerModel.findOne({username: decoded.username});
            const rawChats = await chatService.getChats(user._id);

            if (rawChats) {
                const chats = await Promise.all(rawChats.map(async chat => {
                    // Get the other participant
                    const friendId = chat.participants.find(id => !id.equals(user._id));
                    const friend = await registerModel.findById(friendId);

                    // Get the last message
                    const lastMessage = chat.messages.length > 0 ? await messageModel.findById(chat.messages[chat.messages.length - 1]) : null;

                    return {
                        id: chat._id,
                        user: {
                            username: friend.username,
                            displayName: friend.displayName,
                            profilePic: friend.profilePic
                        },
                        lastMessage: lastMessage ? {
                            id: lastMessage._id,
                            created: lastMessage.created,
                            content: lastMessage.content
                        } : null
                    };
                }));
                res.status(200).json(chats);
            } else {
                res.status(404).send('Chats not found!');
            }
        } catch (err) {
            return res.status(401).send("Invalid Token");
        }
    } else {
        return res.status(403).send('Token required');
    }
};



const createChat = async (req, res) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, key);
        } catch (err) {
            console.log("Token verification failed: ", err.message);
        }
        if (!decoded) {
            return res.status(401).send("Invalid Token");
        }
        try {
            const user = await registerModel.findOne({username: decoded.username});

            // The username of the friend is in the body of the request.
            const {username} = req.body;

            // Call the service with the username of the friend and the user id.
            const {chat, friend} = await chatService.createChat(username, user._id);

            // Respond with the chat id and the friend's information.
            res.status(200).json({
                id: chat._id,
                user: {
                    username: friend.username,
                    displayName: friend.displayName,
                    profilePic: friend.profilePic
                }
            });
        } catch (err) {
            // Check if the error message is 'User cannot add themselves as a friend'
            if (err.message === 'User cannot add themselves as a friend.' || err.message === 'No user with this name exists in the system.') {
                // Send back a specific error message to the client
                return res.status(400).send(err.message);
            } else {
                // For all other errors, send back a generic error message
                return res.status(500).send("Failed adding a friend");
            }
        }
    }
};


const deleteChat = async (req, res) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, key);
        } catch(err) {
            return res.status(401).send("Invalid Token");
        }

        try {
            const chatId = req.params.id;
            const chat = await chatModel.findById(chatId);
            if (!chat) {
                return res.status(404).send('Chat not found');
            }

            const user = await registerModel.findOne({username: decoded.username});
            if (!chat.participants.includes(user._id)) {
                return res.status(403).send('You are not authorized to delete this chat');
            }

            // Delete the chat and its associated messages
            const deleteResult = await chatModel.deleteOne({ _id: chatId });
            await messageModel.deleteMany({ chat: chatId });

            if (deleteResult.deletedCount > 0) {
                // We just return status 200 for success.
                res.sendStatus(200);
            } else {
                res.status(404).send('Chat not found');
            }
        } catch (err) {
            res.status(500).send('Error while deleting chat');
        }
    } else {
        return res.status(403).send('Token required');
    }
};

module.exports = {getChats, createChat, deleteChat};
