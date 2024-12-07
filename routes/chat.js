const chatController = require('../controllers/chat');
const express = require('express')

var router = express.Router();

router.get('/', chatController.getChats);
router.post('/', chatController.createChat);

router.delete('/:id', chatController.deleteChat);

const messageController = require('../controllers/message');
router.get('/:id/Messages', messageController.getMessages);
router.post('/:id/Messages', messageController.addMessage);

module.exports = router;
