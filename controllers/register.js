const registerService = require('../services/register');
const { validationResult } = require('express-validator');

// This method will handle the request from the client and will be responsible to answer to him.
const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // We are waiting for the createUser from the service to be done and just then we will execute.
        const user = await registerService.createUser(req.body);
        // We just return status 200 for success.
        res.sendStatus(200);
    } catch (error) {
        if (error.message === 'This username is already taken.') {
            return res.status(409).json({message: error.message});  // Conflict error
        }
        res.status(500).json({message: error.message});
    }
}

module.exports = {createUser}