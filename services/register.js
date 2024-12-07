// Here we define the logic we can do on the data we define in the model
const Register = require('../models/register');

const createUser = async (userData) => {
    try {
        const existingUser = await Register.findOne({ username: userData.username });
        if (existingUser) {
            // You could throw an error here which can then be caught and handled appropriately in your controller
            throw new Error('This username is already taken.');
        }

        const NewUser = new Register({
            ...userData,  // spread the user data
            chats: []  // add an empty array for chats that we will fill with the user contacts
        });

        // We wait for the method the finish, this way we are not retrieving the promise, we retrieve the object it self.
        // Meaning we return the object itself.
        return await NewUser.save();
    } catch (err) {
        console.error(err);
        throw err;  // Throw the original error to be handled in the controller
    }
};


module.exports = { createUser }