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

exports.postLogin=async(req,res,next)=>{
    try{
    const{email,password}=req.body;
    console.log(password)
    if(isstringinvalid(email) || isstringinvalid(password)){
       return res.status(401).json({message:'email or password is missing',success:false})
    }
    const user=await User.findAll({where:{email}})
        if(user.length>0){
            bcrypt.compare(password,user[0].password,(err,result)=>{
                if(err){
                    throw new Error('something went wrong')
                }
                if(result===true){
                    res.status(200).json({success:true,message:'user logged in successfully',token:generateAccessToken(user[0].id,user[0].name)})
                }else{
                    return res.status(400).json({success:false,message:'Password Is Incorrect'})
                }
            })

        }else{
            return res.status(404).json({success:false,message:'User does not exist'})
        }
    
   } catch{err=>{
        res.status(500).json({message:err,success:false})
    }}
}