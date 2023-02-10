const path=require('path');
const express=require('express');
var cors=require('cors')

const bodyParser = require('body-parser');
const sequelize = require('./util/database');


const app=express();
app.use(cors())
app.use(bodyParser.json());


const userRoutes=require('./routes/user')


const User=require('./models/users');



app.use(userRoutes)



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
