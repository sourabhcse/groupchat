const {Op} =require('sequelize');
const Group=require('../models/group');
const User=require('../models/users');
const Usergroup = require('../models/usergroup');
const Groupchat=require('../models/groupchat');


exports.postCreateGroup=async(req,res)=>{
    try{
        
    const groupName = req.body.groupName;
    await req.user.createGroup({groupName :groupName},{through:{admin:true}})
    res.status(201).json({message:'group created successfully'})
    }catch(err){
        res.status(500).json({message:'server problem'})
    }
}
exports.allGroups=async(req,res)=>{
    try{
    const group = await req.user.getGroups({attributes:['id','groupName'],through:{admin:true}});
    res.status(200).json({group,success:true})
    }catch(err){
        res.status(500).json({message:'server problem'})
    }

}
exports.allUsers=async(req,res)=>{
    try{
    const user=await User.findAll({where:{id:{[Op.ne]: +req.user.id}},
        attributes:['id','email']
    })
        res.status(200).json({user})
    }catch(err){
        res.status(500).json({message:'server problem'})
    }
}
exports.addUser=async(req,res)=>{
    try{
    console.log('fbdh',req.body)
    const {groupName,email} = req.body;
    const admin=req.body.isAdmin;
   
    const user = await User.findOne({where:{email}});
    const group = await Group.findOne({where:{groupName}});
    // console.log(user,group)
    if(!user){
        return res.status(400).json({message:'user or group not found'})
    }
    const userInUserGroup =await Usergroup.findOne({where:{userId:+user.id,groupId:+group.id}});
    if(!userInUserGroup){
        await Usergroup.create({admin,userId:+user.id,groupId:+group.id})
        return res.status(201).json({message:'added user to the group'})
    }
    await Usergroup.update({admin},{where:{userId:+user.id,groupId:+group.id}})
    return res.status(201).json({message:'update user in the group'})
}
catch(err){
    res.status(500).json({message:'server problem'})
}
}
exports.deleteUser=async(req,res)=>{
    try{
    console.log('efgrh',req.body)
    const{groupName,email}=req.body
    const{id:groupId}=await Group.findOne({where:{groupName}})
    console.log('dgch',groupId)
    const userHasPermission=await Usergroup.findOne({where:{admin:true,groupId,userId:+req.user.id}})
    if(userHasPermission){
        const userToBeRemoved=await User.findOne({where:{email}});
        const removeUser=await Usergroup.destroy({
            where:{userId:userToBeRemoved.id,groupId}
        })
        if(removeUser){
            return res.status(200).json({message:'removed user'})
        }
        return res.status(400).json({message:'user is not present in the group'})
    }
    return res.status(404).json({message:'you are not admin to delete the user'})
    }catch(err){
        res.status(500).json({message:'server problem'})
    }
}

exports.allUserGroups=async(req,res)=>{
    try{
    const user =await req.user.getGroups({attributes:['id','groupName']})
    console.log(user)
    res.status(200).json({user,success:true})
}catch(err){
    res.status(500).json({message:err,success:false})
}
}
exports.groupMessage=async(req,res)=>{
    try{
        console.log(req.body)
        const{groupMessage,groupId} =req.body;
        const userName=req.user.name;
        console.log(groupMessage,groupId)
        if(!groupMessage || !groupId){
            return res.status(400).json({message:'bad parameters'})
        }
        const response=await req.user.createGroupchat({groupMessage:groupMessage,groupId:+groupId,userName})
        res.status(200).json({message:'message sent successfully'})
    }
    catch(err)  {
        res.status(500).json({message:err,success:false})
    }
}
exports.allGroupMesssage=async(req,res)=>{
    try{
        const groupId=+req.params.groupchat;
        console.log(groupId)
        const groupMessages=await Groupchat.findAll({
            limit:15,
            order:[["updatedAt","DESC"]],
            where:{groupId},
            attributes:["groupMessage","userName"]
        })
        console.log(groupMessages)
        res.status(200).json({groupMessages:groupMessages.reverse(),message:'successful'})
    }
    catch(err){
        res.status(500).json({message:err,success:false})
    }
}