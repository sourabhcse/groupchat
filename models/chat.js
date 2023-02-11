const Sequelize = require('sequelize');

const sequelize = require('../util/database');
const Chat=sequelize.define('chat',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    chatMessage:{
        type:Sequelize.STRING,
        allowNull:false
    },
    toUser:{
        type:Sequelize.INTEGER,
        allowNull:false

    }
});
module.exports=Chat