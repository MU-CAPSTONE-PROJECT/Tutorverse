const { Sequelize, DataTypes } = require('sequelize');

//New Sequelize instance
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/data.sqlite'
});

const User = sequelize.define('Users',
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
      
    },
    userRole: {
      type: DataTypes.STRING,
    },
    school: {
      type: DataTypes.STRING,
    },
    major: {
      type: DataTypes.STRING,
    },
    imageUrl:{
      type: DataTypes.STRING,
    }
  }
  
);

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
})();

module.exports = { sequelize,User}