const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const User=require('../models/users');
function isstringinvalid(string){
    if(string==undefined || string.length==0){
        return true
    }else{
        return false
    }
}
function generateAccessToken(id,name){
    return jwt.sign({userId:id,name:name},'secretkeyorbigggervalue')

}

exports.postSignUp = async(req,res,next)=>{
    try{
    console.log(req.body)
    
    const {name,email,phonenumber,password} = req.body
   
    if(isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(phonenumber)|| isstringinvalid(password)){
        return res.status(401).json({message:'please fill up all the details'})
    }
    const user=await User.findOne({where:{email:email}})
    if(user){
        return res.status(400).json({message:'user alredy exists >>>please try Login'})
    }
    const saltrounds=10
    bcrypt.hash(password,saltrounds,async(err,hash)=>{
        if(err){
            throw new Error(err)
        }
       
      
        await User.create({name,email,phonenumber,password:hash})
        res.status(201).json({message:'succesfully create new user'})
    })
  
}
    catch(err){
      res.status(500).json({message:'something went wrong'})
    }
}
