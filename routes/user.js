const express = require('express');
const router = express.Router();
const userController = require('../controllers/user')
router.post('/user/signup',userController.postSignUp)

module.exports=router;
