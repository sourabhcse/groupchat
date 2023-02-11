const express = require('express');
const router = express.Router();
const auth=require('../middleware/auth');
const chatController=require('../controllers/chat');
router.get('/chat/allusers',auth,chatController.getAllusers);
router.post('/chat/chatmessage',auth,chatController.postChatMessage);
router.get('/chat/allchats/:chatpersonId',auth,chatController.getAllChats);
module.exports=router;