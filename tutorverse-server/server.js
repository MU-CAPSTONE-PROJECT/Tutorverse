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

const SequelizeSession = SequelizeSessionInit(session.Store);
const sessionStore = new SequelizeSession({
  db: sequelize,
//   table: User, 
});


//Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
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
app.get('/tutors', (req,res) => {
    const userSession = req.session.user
    console.log(userSession)
    if(!userSession){

        res.status(200).json({isLoggedIn: false})

        return
    }

    res.json({message:'User is logged in!'});
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