const admin = require("firebase-admin");

const sendNotification = async (firebaseToken, title, body) => {
    const payload = {
        notification: {
            title: title,
            body: body
        }
    };

    try {
        const response = await admin.messaging().sendToDevice(firebaseToken, payload);
        console.log('Successfully sent message:', response);
    } catch (error) {
        console.log('Error sending message:', error);
    }
};

module.exports = { sendNotification }
