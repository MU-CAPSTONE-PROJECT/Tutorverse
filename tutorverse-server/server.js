//imports
const express = require("express");

const app = express();

const session = require("express-session");

const cors = require("cors");

const { sequelize, User , Message, Rating, Schedule} = require("./data");

const { Op } = require ('sequelize');

const fetch = require("node-fetch");

const bodyParser = require("body-parser");

const userRoutes = require("./routes/userRoutes");

const SequelizeSessionInit = require("connect-session-sequelize");

const SequelizeSession = SequelizeSessionInit(session.Store);
const sessionStore = new SequelizeSession({
  db: sequelize
});

//Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  }),
);

app.use(bodyParser.json());

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

//Recommended Tutor API
app.get("/tutors/recommended", async(req,res) =>{

  //Use req.body.user.session

  studentId = req.body.id;
  const tutorsInteractedWithIds = [];
  //Find IDS of all tutors student sent message to
  const tutorsMessagedIds = await Message.findAll(
    {where:{senderId: studentId},
    attributes: [
      [sequelize.fn('DISTINCT',sequelize.col('recepientId')),'uniqueId']]
  })
  console.log(tutorsMessagedIds[0].getDataValue("uniqueId"))
  
  tutorsMessagedIds.forEach(tutor =>
    tutorsInteractedWithIds.push(tutor.getDataValue('uniqueId'))
  )
  
  //Find IDs of all tutors students rated
  const tutorsRatedIds = await Rating.findAll(
    {where:{studentId},
      attributes: [
      [sequelize.fn('DISTINCT',sequelize.col('tutorId')),'uniqueId']]
    }
  )
  tutorsRatedIds.forEach((tutor) => 
    tutorsInteractedWithIds.push(tutor.getDataValue('uniqueId'))
  )
  const tutorIdsSet = new Set()

  tutorsInteractedWithIds.forEach(id =>{
    tutorIdsSet.add(id)
  })
  console.log(tutorIdsSet)

  //Filter by rating and schedule availability
  const highlyRatedTutorIds = []
  
  const tutorIds = Array.from(tutorIdsSet)

  User.findAll({where:{id:tutorIds, rating: {[Op.gt]:2},  }}).then(tutors =>{
    tutors.map(tutor =>{
      highlyRatedTutorIds.push(tutor.id)

    });
    console.log(highlyRatedTutorIds)

    const weekDays = ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const dayToday = weekDays[new Date().getDay()];

    async function fetchTutorsWithSessionToday() {
      try {
         // Track unique tutor IDs
        const uniqueTutorIds = new Set();
        const currentHour = new Date().getHours();

        const tutors = await Schedule.findAll({
          where: { 
            tutorId: highlyRatedTutorIds, 
            dayOfWeek: dayToday },
            startTime: { [Op.gte]: currentHour }, //Exclude sessions that have passed
        });
       
        tutors.forEach((tutor) => {
          uniqueTutorIds.add(tutor.tutorId);
          
        });

        const tutorsWithSessionToday = await Promise.all(
          Array.from(uniqueTutorIds).map((tutorId) => {
            return User.findOne({ where: { id: tutorId } });
          })
        );

        console.log(tutorsWithSessionToday);
        return res.json(tutorsWithSessionToday);

      } catch (error) {
        console.error("Failed to fetch schedule:", error);
      }
    }

    fetchTutorsWithSessionToday();
        
  }).catch(error => {
    console.log(error,"Failed to fetch tutors")
  })
  
})

//Individual tutor
app.get("/tutor/:tutorId", async (req, res) => {
  const tutorId = parseInt(req.params.tutorId);
  const tutor = await User.findOne({ where: { id: tutorId } });
  if (tutor) {
    
    res.status(200).json({ data: tutor });
  } else {
    res.status(404).json({ error: "Tutor not found" });
  }
});

//Endpoint for retrieving messages from DB
app.get('/messages', async (req, res) => {

  const id = req.session.user.id;

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

async function updateTutorRating(tutorId) {
  try {
    const result = await Rating.findOne({
      where: { tutorId },
      attributes: [
        [sequelize.fn("AVG", sequelize.col("rating")), "averageRating"],
      ],
      raw: true,
    });

    const avgRating = result.averageRating || 0;

    await User.update(
      { rating: avgRating },
      { where: { id: tutorId } }
    );

    console.log(`Tutor rating updated for ID: ${tutorId}`);
  } catch (error) {
    console.error("Failed to update tutor rating:", error);
  }
}

//Save new tutor ratings to db
app.post("/ratings", async (req,res) =>{
  const { studentId, tutorId, rating } = req.body;

  try{
    const existingRating = await Rating.findOne({where:{studentId, tutorId}})
    if(existingRating===null){
      const newRating = await Rating.create({
        studentId, 
        tutorId, 
        rating
      });
      console.log(newRating)
      await updateTutorRating(tutorId);
      return res.status(200).json({message: "Rating saved successfully"});

    } else{

        //Update existing entry
        await Rating.update({rating}, {where: {studentId, tutorId}});
        await updateTutorRating(tutorId);
      return res.status(200).json({ message: "Rating updated successfully" });
    }
  } 
  catch(error){
    console.log(error, "Failed to update or save tutor rating")
    return res.status(200).json({message: "Internal server error. Failed to save rating"})
  }

})

app.listen(3000, function (err) {
  if (!err) console.log("Server is running!");
  else console.log(err);
});

(async () => {
  try {
    await sequelize.sync();
    console.log("Database synchronized");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
})();
module.exports = app;
