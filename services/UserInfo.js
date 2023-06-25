const registerModel = require('../models/register');
const UserInfo = require('../models/userinfo');

const getUserInfo = async (username, firebaseToken) => {
    try {
        const user = await registerModel.findOne({ username: username });
        if (!user) {
            throw new Error('User not found');
        }

        // Fetch the user info or create a new one if it does not exist
        let userInfo = await UserInfo.findOne({ username: username });
        if (!userInfo) {
            userInfo = new UserInfo({
                username: user.username,
                displayName: user.displayName,
                profilePic: user.profilePic,
            });
        }

        // Update the Firebase token for the user if it exists
        if (firebaseToken) {
            userInfo.firebaseToken = firebaseToken;
            await userInfo.save();
        }

        return {username: user.username, displayName: user.displayName, profilePic: user.profilePic}
    } catch (err) {
        console.error(err);
        throw err;
    }
};

module.exports = {getUserInfo}
