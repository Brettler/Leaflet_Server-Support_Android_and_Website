const Message = require("../models/message");
const Chat = require("../models/chat");
const notificationService = require('../services/NotificationService');
const InfoUser = require('../models/InfoUser');
const registerModel = require('../models/register');

// We set the io varaible in app.js
let io; // Placeholder variable for the Socket.io instance
const setIo = function(ioInstance) {
    io = ioInstance;
};

const addMessage = async (chatId, messageData) => {
    try {
        const message = new Message(messageData);
        const savedMessage = await message.save();
        console.log("SavedMessage: ", savedMessage);
        const chat = await Chat.findById(chatId);
        chat.messages.push(savedMessage);
        await chat.save();

        // Retrieve the saved message again to populate sender details
        const populatedMessage = await Message.findById(savedMessage._id).populate('sender', 'username displayName profilePic');

        // emit newMessage event to all connected sockets
        if (io) {
            io.emit('newMessage', { chatId, message: populatedMessage});
        }

        // Sending notifications using firebase:
        // Retrieve recipients' user info
        const recipients = chat.participants.filter(participant => participant.toString() !== messageData.sender.toString());

        // For each recipient, check if they are using an Android device and send appropriate notification
        for (let recipientId of recipients) {
            const recipient = await registerModel.findById(recipientId);
            const recipientInfo = await InfoUser.findOne({ username: recipient.username });

            // Check if the recipient is using Android (has a Firebase token)
            if (recipientInfo && recipientInfo.firebaseToken) {
                // Send Firebase notification
                console.log("Trying to execute notificationService.sendNotification!")
                await notificationService.sendNotification(
                    recipientInfo.firebaseToken,
                    'New message from ' + populatedMessage.sender.displayName,
                    populatedMessage.content

                );
                console.log("Sent notification using  Firebase: ", populatedMessage.content)
            }
        }
        return populatedMessage;
    } catch (err) {
        console.error(err);
        throw new Error('Error while adding message');
    }
};

const getMessages = async (chatId) => {
    try {
        const chat = await Chat.findById(chatId).populate({
            path: 'messages',
            options: { sort: { 'created': -1 } },
            populate: { path: 'sender', select: 'username' }
        });
        return chat.messages;
    } catch (err) {
        console.error(err);
        throw err;
    }
};


module.exports = { addMessage, getMessages, setIo }