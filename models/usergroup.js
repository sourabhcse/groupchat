const Sequelize = require('sequelize');

const sequelize = require('../util/database');
const Usergroup=sequelize.define('usergroup',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    admin:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
    }
});
module.exports=Usergroup;