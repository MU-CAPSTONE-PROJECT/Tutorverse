//imports
const express = require('express');

const app = express();

const cors = require('cors');

const fetch = require('node-fetch');

//Middleware
app.use(cors());

app.use(express.json({extended: false}));

//Test endpoint
app.get('/', (req,res) => {
    res.send('Server connected!');
});

//Endpoint for fetching US Universities list
app.get('/pick_uni', (req,res) => {
    
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
                console.log(schoolsList)
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