//imports
const express = require("express");

const app = express();

const session = require("express-session");

const cors = require("cors");

const { sequelize, User , Message, Rating, Schedule} = require("./data");

const haversine = require('haversine-distance')

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

//List of all tutors
app.get("/tutors/all", async (req, res) => {
  console.log(req.session.user);
  try {
    const currUser = req.session.user;
    const tutors = await User.findAll({
      where: { userRole: "tutor", school: currUser.school },
    });
    return res.status(200).json(tutors);
  } catch (error) {
    return res.status(404).json({error});
  }
});

//List of active tutors
app.get("/tutors/active", async (req, res) => {
  
  try {
    const currUser = req.session.user;
    const tutors = await User.findAll({
      where: { userRole: "tutor", school: currUser.school, activeStatus: 1 },
    });
    return res.status(200).json(tutors);
  } catch (error) {
    return res.status(404).json({error});
  }
});

//Recommended Tutor API
app.get("/tutors/recommended", async(req,res) =>{

  const student = req.session.user
  const studentId = student.id
  const tutorsInteractedWithIds = [];
  //Find IDS of all tutors student sent message to
  const tutorsMessagedIds = await Message.findAll(
    {where:{senderId: studentId},
    attributes: [
      [sequelize.fn('DISTINCT',sequelize.col('recepientId')),'uniqueId']]
  })
  
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

  User.findAll({where:{id:tutorIds, rating: {[Op.gt]:2},  }}).then( async tutors =>{
    tutors.map(tutor =>{
      highlyRatedTutorIds.push(tutor.id)

    });

    const weekDays = ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const dayToday = weekDays[new Date().getDay()];

    async function fetchRecommendedTutors() {
      try {
         // Track unique tutor IDs
        const uniqueTutorIds = new Set();
        const currentHour = new Date().getHours();

        const tutors = await Schedule.findAll({
          where: { 
            tutorId: highlyRatedTutorIds, 
            dayOfWeek: dayToday, //Tutors who have sessions today
            // startTime: { [Op.gte]: currentHour }, //Exclude sessions that have passed
          },
          order: [['startTime', 'ASC']], // Order by startTime in ascending order
          
            
        });
        
        tutors.forEach((tutor) => {
          uniqueTutorIds.add(tutor.tutorId);
          
        });

        const result = await Promise.all(
          Array.from(uniqueTutorIds).map((tutorId) => {
            return User.findOne({ where: { id: tutorId } });
          })
        );
        const recommendedTutors = []

        result.map(tutor=>{
          recommendedTutors.push(tutor.dataValues)
        })
        
        console.log(highlyRatedTutorIds, "IDS")
        console.log(recommendedTutors)
        
        //Recommended Tutor Score
        const tutorsWithScores = await Promise.all(recommendedTutors.map( async tutor =>{
          const messageCount = await Message.count({
            where:{ [Op.or]: [{senderId: tutor.id}, {recepientId: tutor.id}]}
          })

          const averageRating = tutor.rating;

          const rating = await Rating.findOne({where: {studentId}})

          const studentRatingForTutor = rating.getDataValue('rating')

          // retrieve timestamp
          const timestamp = tutor.createdAt
          const accountCreationDate = new Date(timestamp);
          const currentDate = new Date();  // Get the current date

          // Calculate the account age in months
          const accountAge = (currentDate.getFullYear() - accountCreationDate.getFullYear()) * 12 +
            currentDate.getMonth() - accountCreationDate.getMonth();
            
          //Calculate distance using Haversine function for distance on spheres
          const distanceFromStudent = (haversine(
            {latitude:student.latitude, longitude: student.longitude},
             {latitude: tutor.latitude, longitude: tutor.longitude})) * 0.000621371   //to miles

          const activeStatus = tutor.activeStatus

          const slotsPerWeek = await Schedule.count({
            where: {tutorId: tutor.id}
          })

          //Calculate Recommendation Percentage Score
          const calculateTutorScore = () => {
            const scoringRanges = {
              messageCount: [
                { range: [0, 0], score: 0 },
                { range: [0, 5], score: 5 },
                { range: [5, 10], score: 10 },
                { range: [10, 50], score: 20 },
                { range: [50, Infinity ], score: 30 },
              ],
              averageRating: [
                { range: [0, 2], score: 0 },
                { range: [2, 4], score: 10 },
                { range: [4, 5], score: 20 },
              ],
              studentRatingForTutor: [
                { range: [0, 4], score: 0 },
                { range: [4, 4.5], score: 10 },
                { range: [4.5, 6], score: 20 },
              ],
              accountAge: [
                { range: [0, 0], score: 0 },//months
                { range: [0, 1], score: 5 }, 
                { range: [1, 6], score: 10 },
                { range: [2, Infinity], score: 20 },
              ],
              distanceFromStudent: [
                { range: [5, Infinity], score: 5 }, //miles
                { range: [3, 5], score: 10 },
                { range: [1, 3], score: 20 },
                { range: [0, 1], score: 30 }, 
              ],
              activeStatus: [
                { range: [0, 1], score: 0 }, // Not active
                { range: [1, Infinity], score: 10 }, // Active
              ],
              slotsPerWeek: [
                { range: [0, 1], score: 5 },
                { range: [1, 3], score: 10 },
                { range: [3, Infinity], score: 20 },
              ]
            }
            const scoringWeights = {
              messageCount: 0.20,
              averageRating: 0.05,
              studentRatingForTutor: 0.05,
              accountAge: 0.05,
              distanceFromStudent: 0.25,
              activeStatus: 0.30,
              slotsPerWeek: 0.10,
            
            }
            const attributes = {

              messageCount: messageCount,
              averageRating: averageRating,
              studentRatingForTutor: studentRatingForTutor,
              distanceFromStudent: distanceFromStudent,
              accountAge: accountAge,
              activeStatus: activeStatus,
              slotsPerWeek: slotsPerWeek,
            }

            // Calculate the weighted sum of all tutor's attributes
            const weightedSum = Object.keys(attributes).reduce((sum, attribute) => {
              const attributeValue = attributes[attribute];

              // Find the appropriate scoring range for the attribute's value  
                const attributeScoringRange = scoringRanges[attribute].find(range =>
                attributeValue >= range.range[0] && attributeValue < range.range[1]
              );

              // Multiply score from range by assigned weight
              const attributeScore = attributeScoringRange.score * scoringWeights[attribute];
              
              // Add the weighted score to the accumulated sum
              return sum + attributeScore;
            }, 0);

            // Calculate the total possible score
            const maxScore = Object.keys(attributes).reduce(
              (sum, attribute) => sum + scoringRanges[attribute][scoringRanges[attribute].length-1].score * scoringWeights[attribute],
              0
            );
            const percentageScore = (weightedSum/maxScore) * 100;
              return percentageScore
          }
          const tutorScore = calculateTutorScore();
          
          
          tutor.score = Math.trunc(tutorScore)+20
         
          return tutor
        }));
        
        return tutorsWithScores
      } catch (error) {
        console.error("Failed to fetch schedule:", error);
      }
      

    };

    const finalTutorsList = await fetchRecommendedTutors();
    
    return res.json(finalTutorsList)
        
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
app.post('/messages', async (req, res) => {

  console.log(req.body, "nooooo")
  const id = req.body.user.id;
  const chat = req.body.selectedUser

  try{

    //retrieve all messages where user is either sender or recipient
    const messages = await Message.findAll({where: 
    {[Op.or]:[
    { [Op.and]: [
      {senderId: id},
      {recepientId: chat.id}
    ]
    }, {
      [Op.and]: [
        {senderId: chat.id},
        {recepientId: id}
      ]
      }
    ]}
  })
  console.log("success!", messages)
  return res.status(200).json(messages)

  } catch (error) {
    console.log("Failed to save message ", error);
    return res.status.apply(500).json({ error: "Internal server error"})
  };
});

//Chatlist endpoint
app.get("/chatlist", async (req,res) => {
  const currUser = req.session.user
  console.log(currUser.userRole,"GAAA")
  if (currUser.userRole==="student"){
    try {

      const messages = await Message.findAll({
        where: {
          [Op.or]: [
            { recepientId: currUser.id },
            { senderId: currUser.id }
          ]
        },
        order: [['createdAt', 'DESC']]
      });
     

      // Extract unique tutor IDs from the retrieved messages
      const tutorIds = new Set();
      messages.forEach((message) => {
        if (message.senderId !== currUser.id) {
          tutorIds.add(message.senderId);
        }
        if (message.recepientId !== currUser.id) {
          tutorIds.add(message.recepientId);
        }
      });
      
      // Convert the set of tutor IDs to an array 
      const uniqueTutorIds = Array.from(tutorIds);
      console.log(uniqueTutorIds)
      const tutors = await Promise.all(
        uniqueTutorIds.map(async (id) => {
          return await User.findOne({ where: { id } });
        })
      );
    
      const additionalTutors = await User.findAll({
        where: {[Op.and]: [
          {userRole: 'tutor', school: currUser.school},
          {[Op.not]: [{id: uniqueTutorIds}]}
        ]}
      });
    
      const allTutors = [...tutors, ...additionalTutors];
    
      return res.status(200).json(allTutors);
      
    } catch (error) {
      return res.status(404).json({ message: error, list: null });
    }
  } else{
    const studentIDs = new Set();
    
    Message.findAll({ 
      where: {recepientId: req.session.user.id},
      order: [['createdAt', 'DESC']]
    
    }).then(messages => {
      messages.map((message) => 
        studentIDs.add(message.senderId)
      );
      console.log(studentIDs)
      
    const students = Array.from(studentIDs);
    const fetchedStudents = [];

    Promise.all(
      students.map(async (studentId) => {
        try {
          const student = await User.findOne({ where: { id: studentId } });
          fetchedStudents.push(student);
        } catch (error) {
          console.error('Error fetching students:', error);
          res.status(500).json({ error: "Internal server error" });
        }
      })
    
      )
      .then(() => {
        res.json(fetchedStudents)
      });

    
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

    const avgRating = (result.averageRating || 0).toFixed(2);


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
