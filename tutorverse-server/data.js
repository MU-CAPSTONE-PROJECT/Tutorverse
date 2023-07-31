const { Sequelize, DataTypes } = require("sequelize");
const { default: TutorView } = require("../tutorverse-client/TutorView/TutorView");

//New Sequelize instance
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database/data.sqlite",
});

const User = sequelize.define("Users", {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  firstName: {
    type: DataTypes.STRING,
  },
  lastName: {
    type: DataTypes.STRING,
  },
  emailAddress: {
    type: DataTypes.STRING,
  },
  password: {
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
  imageUrl: {
    type: DataTypes.STRING,
  },
  latitude: {
    type: DataTypes.DOUBLE,     
  },
  longitude: {
    type: DataTypes.DOUBLE,
  }
});

const Message = sequelize.define('Messages', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,

  },
  senderId: {
    type: DataTypes.INTEGER,
  },
  recepientId: {
    type: DataTypes.INTEGER,
  },
  content: {
    type: DataTypes.STRING,
  },
});

const Rating = sequelize.define('Ratings', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  studentId: {
    type: DataTypes.INTEGER,

  },
  tutorId: {
    type: DataTypes.INTEGER,
  },
  rating: {
    type: DataTypes.DOUBLE,
  },

})

async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database synchronized");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
};

module.exports = { sequelize, User, Message };
