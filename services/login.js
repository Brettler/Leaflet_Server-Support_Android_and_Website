const Register = require('../models/register');

const getCredentials = async (username, password) => {
    try {
        return await Register.findOne({ username: username, password: password });
    } catch (err) {
        console.error(err);
        throw new Error('Error while fetching user');
    }
};

module.exports = { getCredentials }
