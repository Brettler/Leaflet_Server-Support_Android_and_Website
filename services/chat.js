const Chat = require('../models/chat');

const getChats = async (userId) => {
    try {
        const chats = await Chat.find({participants: userId}).populate({
            path: 'messages',
            options: { sort: { 'created': 1 }},
            populate: { path: 'sender' }
        });
        return chats;
    } catch (err) {
        throw err;
    }
};

const registerModel = require('../models/register')

const createChat = async (username, userId) => {
    try {
        // Find the friend in the database.
        const friend = await registerModel.findOne({username: username});

        // If the friend is not found, throw an error.
        if (!friend) {
            throw new Error('No user with this name exists in the system.');
        }
        // If the friend's id is the same as the user's id, throw an error.
        if (friend._id.toString() === userId.toString()) {
            throw new Error('User cannot add themselves as a friend.');
        }

        // Create a new chat with the authenticated user and the friend.
        const chat = new Chat({ participants: [userId, friend._id] });

        // Save the chat to the database and return it.
        const newChat = await chat.save();

        // Now add the new chat to both the user and the friend's list of chats.
        const user = await registerModel.findByIdAndUpdate(
            userId,
            { $push: { chats: newChat._id } },
            { new: true, useFindAndModify: false }
        );

        await registerModel.findByIdAndUpdate(
            friend._id,
            { $push: { chats: newChat._id } },
            { new: true, useFindAndModify: false }
        );

        // Return the chat and the friend.
        return {chat: newChat, friend: friend};
    } catch (err) {
        throw err;  // Re-throw the original error.
    }
};

module.exports = {getChats, createChat};
