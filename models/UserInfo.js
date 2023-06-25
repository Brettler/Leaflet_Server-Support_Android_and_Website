const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// This file only define the structure of the data.
const UserInfo = new Schema({
    username: {
        type: String,
        require: true
    },
    displayName: {
        type: String,
        require: true
    },
    profilePic: {
        type: String,
        require: true
    },
    firebaseToken: {
        type: String,
        require: false
    }
});
module.exports = mongoose.model('UserInfo', UserInfo)