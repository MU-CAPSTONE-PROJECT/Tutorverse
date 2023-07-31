//imports
const express = require("express");

const app = express();

const session = require("express-session");

const cors = require("cors");

const { sequelize, User , Message, Rating} = require("./data");

const fetch = require("node-fetch");

const bodyParser = require("body-parser");

const userRoutes = require("./routes/userRoutes");

const SequelizeSessionInit = require("connect-session-sequelize");
const { where } = require("sequelize");

const SequelizeSession = SequelizeSessionInit(session.Store);
const sessionStore = new SequelizeSession({
  db: sequelize,
  //   table: User,
});

//Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  }),
);

app.use(bodyParser.json({ extended: false }));

//Session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      sameSite: "lax",
      secure: false,
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  }),
);

app.use("/user", userRoutes);
sessionStore.sync();

//Testing DB connection
async function TestConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
TestConnection();

//Test endpoint
app.get("/auth", (req, res) => {
  try {
    const userSession = req.session.user;
    console.log(userSession);
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    } else {
      return res
        .status(201)
        .json({ message: "User is logged in!", user: userSession });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Something went wrong!");
  }
});

// Endpoint to update the user data in the cookie
app.post("/updateUser", (req, res) => {
  const userData = req.body;

  req.session.user = userData;
  res.sendStatus(200);
});

//Saving User Location in database
app.post("/save/location", async (req, res) => {

  try{
    const userLocation = req.body.location;
    const lat = userLocation.latitude;
    const long = userLocation.longitude
    const currUser = req.session.user;
    const userId = currUser.id;
    console.log(userId)

    const updatedRow = await User.update({latitude: lat, longitude:long}, {
      where: { id: userId },
    })
    console.log(updatedRow);
    console.log(userLocation);
    return res.status(200).json({message:"Location saved successfully!"})
  }
  catch (error) {
    return res.status(400).json({message: "Failed to save location!"})
  }
  
})

//List of tutors
app.get("/tutors", async (req, res) => {
  console.log(req.session.user);
  try {
    const currUser = req.session.user;
    const tutors = await User.findAll({
      where: { userRole: "tutor", school: currUser.school },
    });
    return res.status(200).json({ list: tutors });
  } catch (error) {
    return res.status(404).json({ message: error, list: null });
  }
});

//Individual tutor
app.get("/tutor/:tutorId", async (req, res) => {
  const tutorId = parseInt(req.params.tutorId);
  const tutor = await User.findOne({ where: { id: tutorId } });
  if (tutor) {
    console.log(tutor);
    res.status(200).json({ data: tutor });
  } else {
    res.status(404).json({ error: "Tutor not found" });
  }
});

//Endpoint for retrieving messages from DB
app.get('/messages', async (req, res) => {

  const id = req.session.user.id;
  const { Op } = require ('sequelize');

  try{

    //retrieve all messages where user is either sender or recipient
    const messages = await Message.findAll({where: 
    
    { [Op.or]: [
      {senderId: id},
      {recepientId: id}
    ]
  }
  })
  console.log("success!")
  return res.status(200).json(messages)

  } catch (error) {
    console.log("Failed to save message ", error);
    return res.status.apply(500).json({ error: "Internal server error"})
  };
});

//Chatlist endpoint
app.get("/chatlist", async (req,res) => {
  if (req.session.user.userRole==="student"){
    try {
      const currUser = req.session.user;
      const tutors = await User.findAll({
        where: { userRole: "tutor", school: currUser.school },
      });
      return res.status(200).json(tutors);
    } catch (error) {
      return res.status(404).json({ message: error, list: null });
    }
  } else{
    Message.findAll({ where: {recepientId: req.session.user.id}}).then(messages => {
      const studentIDs = messages.map(message => message.senderId);
      User.findAll({where: {id: studentIDs}})
      .then(students => res.json(students))
      .catch(error => {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: "Internal server error"})
      })
      
    
  }).catch(error => {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
    });
}
}) 
//Endpoint for fetching US Universities list
app.get("/pick_uni", (req, res) => {
  const userSession = req.session.user;
  console.log(userSession);
  const fetchSchools = async () => {
    try {
      //third-party API fetch from Back4App website
      const response = await fetch(
        "https://parseapi.back4app.com/classes/Usuniversitieslist_University?&order=name",
        {
          headers: {
            "X-Parse-Application-Id":
              "zmU5EWxwmKH1PAFE1rzjS7OIBbHu9AkHCluAvg1A", // application id
            "X-Parse-REST-API-Key": "7nlbgFrZGpAzwQ9laCtrSm25ioO1vgclGw86ajl2", //REST API key
          },
        },
      );
      const schoolsList = await response.json();
      return res.json(schoolsList);
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
  fetchSchools();
});

//Save new tutor ratings to db
app.get("/ratings", async (req,res) =>{
  const studentId = req.session.user.id;
  const tutorId = req.body.tutorId;
  const rating = req.body.rating;
  try{
    await Rating.update({studentId: studentId, tutorId: tutorId, rating: rating})
    return res.status(200).json({message: "Rating saved successfully"})
  } 
  catch(error){
    console.log(error)
    return res.status(200).json({message: "Internal server error. Failed to save rating"})
  }
 
})

//Calculate average tutor rating
app.get("/avg_rating",async (req,res)=> {

  const tutorId = req.body.tutorId;
  try {
    const result = await Rating.findOne({where: {tutorId: tutorId}},
      {attributes: [sequelize.fn("AVG", sequelize.col("rating"))],
      raw: true
      }
    )
    let avgRating;
    if(result.dataValues.rating ===null){
      avgRating = 0;
    } else{
      avgRating = result.dataValues.rating;
    }
    
    return res.status(200).json(avgRating)

  } catch(error){
    return res.status(400).json({message: "Failed to retrieve rating"})
    console.log(error)
  }

})

app.listen(3000, function (err) {
  if (!err) console.log("Server is running!");
  else console.log(err);
});

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database synchronized");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
})();
module.exports = app;
