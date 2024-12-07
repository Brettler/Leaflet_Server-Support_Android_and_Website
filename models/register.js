const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Register = new Schema({
    username: {
      type: String,
      require: true
    },
    password: {
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
    chats: [{type: mongoose.Schema.Types.ObjectId, ref: 'Chat'}]


});
module.exports = mongoose.model('Register', Register)