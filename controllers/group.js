const {Op} =require('sequelize');
const Group=require('../models/group');
const User=require('../models/users');
const Usergroup = require('../models/usergroup');
const Groupchat=require('../models/groupchat');


exports.postCreateGroup=async(req,res)=>{
    try{
        // console.log('dfghfhd',req.body)
    const groupName = req.body.groupName;
    await req.user.createGroup({groupName :groupName},{through:{admin:true}})
    res.status(201).json({message:'group created successfully'})
    }catch(err){
        res.status(500).json({message:'internal server problem'})
    }
}
exports.allGroups=async(req,res)=>{
    try{
    const group = await req.user.getGroups({attributes:['id','groupName'],through:{admin:true}});
    res.status(200).json({group,success:true})
    }catch(err){
        res.status(500).json({message:'internal server problem'})
    }

}
exports.allUsers=async(req,res)=>{
    try{
    const user=await User.findAll({where:{id:{[Op.ne]: +req.user.id}},
        attributes:['id','email']
    })
        res.status(200).json({user})
    }catch(err){
        res.status(500).json({message:'internal server problem'})
    }
}
exports.addUser=async(req,res)=>{
    try{
    console.log('fbdh',req.body)
    const {groupName,email} = req.body;
    const admin=req.body.isAdmin;
    // console.log(admin)
    // console.log(groupName)
    // console.log(email)
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
    res.status(500).json({message:'internal server problem'})
}
}
