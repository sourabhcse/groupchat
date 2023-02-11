const Sequelize = require('sequelize');

const sequelize = require('../util/database');
const Groupmessage=sequelize.define('groupchat',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    groupMessage:{
        type:Sequelize.STRING,
        allowNull:false
    },
    groupId:{
        type:Sequelize.INTEGER,
        allowNull:false

    },
    userName:{
        type:Sequelize.STRING,
        allowNull:false
    }
});
module.exports=Groupmessage;