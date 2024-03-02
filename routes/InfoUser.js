const userInfoController = require('../controllers/InfoUser');

const express = require('express')

var router = express.Router();

router.get('/', userInfoController.processUserInfo);

module.exports = router;
