const { body } = require('express-validator');
const registerController = require('../controllers/login');
const express = require('express')

var router = express.Router();

// If someone will request from the server /api/Tokens using 'post' we will respond we creating a new user in the system.
// router.route('/').post(registerController.createUser);
router.post('/',
    [
        body('username').isString(),
        body('password').isString(),
    ],
    registerController.processLogin
);

module.exports = router;