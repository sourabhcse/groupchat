const {Op} =require('sequelize');
const User=require('../models/users');
const Chat=require('../models/chat');

exports.getAllusers=async(req,res)=>{
    try{
    const user =await User.findAll({where:{id:{[Op.ne]: +req.user.id}},
        attributes:['id','name']
    })
    res.status(200).json({user,success:true})
}catch(err){
    res.status(500).json({message:err,success:false})
}
}
exports.postChatMessage=async(req,res)=>{
    try{
        console.log(req.body)
        const chat= req.body.chat;
        const id=req.body.toUser;
        if(!chat){
            return res.status(400).json({message:'please enter the message'})
        }
        await req.user.createChat({chatMessage:chat,toUser:id}).then(()=>{
            console.log(req.user.name)
            res.status(200).json({UserName:req.user.name,message:'message sent successfully'})

        })
    }catch(err){
        res.status(500).json({message:'internal server error',success:false})
    }   
    
}
exports.getAllChats=async(req,res)=>{
    try{
    const chatpersonId = +req.params.chatpersonId;
    if(chatpersonId ==0){
        return res.status(200).json({message:'successful'})
    }
    console.log(chatpersonId)
    const chatTwoWay=await Chat.findAll({
        limit:10,
        order:[["updatedAt","DESC"]],
        where:{
            [Op.or]:[
                {toUser:chatpersonId,userId:+req.user.id},
                {toUser:+req.user.id,userId:chatpersonId}
            ]
        },
        attributes:['chatMessage'],
        include:{
            model:User,
            where:{
                [Op.or]:[{id:+req.user.id},{id:chatpersonId}]
            },
            attributes:['name']
        }

    })
        res.status(200).json({chats:chatTwoWay.reverse(),success:true})
}catch(err){
    res.status(500).json({message:'internal server error',success:false})
}
    }