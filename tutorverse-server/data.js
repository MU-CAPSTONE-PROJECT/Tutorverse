const { Sequelize, DataTypes } = require('sequelize');

//New Sequelize instance
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/data.sqlite'
});

const User = sequelize.define('User',
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    firstName : {
      type: DataTypes.STRING,
    },
    lastName : {
      type: DataTypes.STRING,
      
    },
    emailAddress : {
      type: DataTypes.STRING,
      
    },
    password : {
      type: DataTypes.STRING,
      
    }
    
  }
)

module.exports = { sequelize,User}