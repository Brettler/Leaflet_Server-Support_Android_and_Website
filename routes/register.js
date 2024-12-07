// This file is going to connect between the routes from the client and the action of the controller.
const { body } = require('express-validator');
const registerController = require('../controllers/register');
const express = require('express')

var router = express.Router();

// If someone will request from the server /api/Users using 'post' we will respond we creating a new user in the system.
// router.route('/').post(registerController.createUser);
router.post('/',
    [
        body('username').isString(),
        body('password').isString(),
        body('displayName').isString(),
        body('profilePic').isString().optional()
    ],
    registerController.createUser
);

module.exports = router;