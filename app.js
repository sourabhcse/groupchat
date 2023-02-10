const path=require('path');
const express=require('express');
var cors=require('cors')

const bodyParser = require('body-parser');
const sequelize = require('./util/database');


const app=express();
app.use(cors({
origin:"http://localhost:3500",
credentials:true}))
app.use(bodyParser.json());

//routes
const userRoutes=require('./routes/user')
const chatRoutes=require('./routes/chat')
const groupRoutes=require('./routes/group')

//models
const User=require('./models/users');
const Chat=require('./models/chat');
const Groupchat=require('./models/groupchat');
const Group=require('./models/group');
const Usergroup = require('./models/usergroup');


app.use(userRoutes)
app.use(chatRoutes)
app.use(groupRoutes)

//joins
User.hasMany(Chat);
Chat.belongsTo(User);


User.hasMany(Groupchat);
Groupchat.belongsTo(User)

User.belongsToMany(Group,{through:Usergroup});
Group.belongsToMany(User,{through:Usergroup});



app.use((req,res)=>{
    console.log('urlll',req.url)
    res.sendFile(path.join(__dirname,`public/${req.url}`));
    
  })

sequelize
  .sync()
  .then(result => {
   console.log(result)
   app.listen(3500)
  })
  .catch((err)=>{
    console.log(err)
  })
