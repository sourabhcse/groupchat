const jwt=require('jsonwebtoken');
const User = require('../models/users');
const auth=(req,res,next) =>{
        const token=req.header('Authorization');
        console.log(token)
        const user=jwt.verify(token,'secretkeyorbigggervalue')
        console.log(user.userId)
        User.findByPk(user.userId).then((user=>{   
            req.user=user;
            console.log(req.user)
            next();
        }))
        
    .catch(err=>{
        return res.status(500).json({success:false})
    })  
}
module.exports=auth;