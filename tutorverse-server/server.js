
//imports
const express = require('express');

const app = express();

const session = require('express-session');

const cors = require('cors');

const {sequelize, User } = require('./data');

const fetch = require('node-fetch');

const bodyParser = require('body-parser')

const userRoutes = require('./routes/userRoutes');

const SequelizeSessionInit = require('connect-session-sequelize');
const { where } = require('sequelize');

const SequelizeSession = SequelizeSessionInit(session.Store);
const sessionStore = new SequelizeSession({
  db: sequelize,
//   table: User, 
});


//Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST'],
  }));

app.use(bodyParser.json({extended: false}));

//Session
app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            sameSite: 'lax',
            secure: false,
            expires: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000))
        }
    })

);

app.use('/user', userRoutes);
sessionStore.sync();

//Testing DB connection
async function TestConnection (){
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
TestConnection();

//Test endpoint
app.get('/auth', (req,res) => {
    try{

        const userSession = req.session.user
        console.log(userSession)
        if(!req.session.user){

            return res.status(401).json({error:'Unauthorized'});
        
        } else{
            return res.status(201).json({message:'User is logged in!', user: userSession});
        }
    
    } catch(error){
        res.status(500).json({ message: error.message });
        console.log("Something went wrong!")
    }
    
});

// Endpoint to update the user data in the cookie
app.post('/updateUser', (req, res) => {
    const userData = req.body;
    
    req.session.user = userData;
    res.sendStatus(200);
});

app.get('/tutors', async (req,res) =>{
    console.log(req.session.user)
    try{

        const currUser = req.session.user;
        const tutors = await User.findAll({where:{userRole:'tutor', school: currUser.school}})
        console.log(tutors);
        return res.status(200).json({list:tutors})
    
    } catch(error){
        return res.status(404).json({message: error, list:null})
    }
    
})
app.get('/tutor/:tutorId', async (req, res) => {
    const tutorId = parseInt(req.params.tutorId);
    const tutor = await User.findOne({where:{id:tutorId}});
    if (tutor) {
        console.log(tutor)
      res.status(200).json({ data: tutor });
    } else {
      res.status(404).json({ error: 'Tutor not found' });
    }
  });

//Endpoint for fetching US Universities list
app.get('/pick_uni', (req,res) => {
    const userSession = req.session.user
    console.log(userSession)
    const fetchSchools = async () => {
        try {   
                //third-party API fetch from Back4App website
                const response = await fetch(
                    "https://parseapi.back4app.com/classes/Usuniversitieslist_University?&order=name",
                    {
                    headers: {
                        "X-Parse-Application-Id":
                        "zmU5EWxwmKH1PAFE1rzjS7OIBbHu9AkHCluAvg1A", // application id
                        "X-Parse-REST-API-Key":
                        "7nlbgFrZGpAzwQ9laCtrSm25ioO1vgclGw86ajl2", //REST API key
                    },
                    }
                );
                const schoolsList = await response.json();
                return res.json(schoolsList);
            
        } catch (error) {
            console.log("Error:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    };
    fetchSchools();
    
})

app.listen(3000, function (err){
    if (!err)
        console.log("Server is running!")
    else console.log(err)
}
)

module.exports = app;