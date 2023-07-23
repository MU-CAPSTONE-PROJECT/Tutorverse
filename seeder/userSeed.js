const fs = require("fs");
const path = require("path");
const { fileURLToPath } = require("url");
const fetch = require("node-fetch");

__filename = fileURLToPath(require("url").pathToFileURL(__filename).href);
__dirname = path.dirname(__filename);

const userData = JSON.parse(
  fs.readFileSync(
    path.resolve(
      __dirname,
      "/Users/tanyachisepo/Code/Tutorverse/seeder/usersMockData.json",
    ),
    "utf8",
  ),
);

const { sequelize, User } = require("../tutorverse-server/data");

async function getCoordinates(university) {

  const apiKey = "AIzaSyCIpZqrYTmqR0pMG9vHXeEx_YK7QIdsXO8";
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${university}, United States&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status=== "OK") {
      const location = data.results[0].geometry.location;
      
      return { latitude: location.lat, longitude: location.lng };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
}

const location = getCoordinates("University of Chicago").then(console.log)


  //List of universities
  const universities = [
  "Harvard University", 
  "Stanford University",
    "Massachusetts Institute of Technology", 
    "California Institute of Technology",
    "Princeton University", 
    "Yale University",
      "University of Chicago",
      "Columbia University", 
      "University of Pennsylvania", 
      "Northwestern University",
      "Berkeley",
      "University of California"
      
  ]

const uniDict = {}
async function generateUniCoordinates() { 

  for (const uni of universities) {
    const coordinates = await getCoordinates(uni);

    if (coordinates) {
      uniDict[uni] = coordinates;

    } else {
      console.log(`Could not find coordinates for ${uni}`);
    }
  }
  
}


const generateRandomCoordinates = (schoolLat, schoolLng, range = 0.05)=> {

  const randomLatitude = schoolLat + ((Math.random () * range)- (range/2));
  const randomLongitude = schoolLng + ((Math.random () * range)- (range/2));

  return {latitude: randomLatitude,longitude: randomLongitude}

}


generateUniCoordinates().then( ()=>{
  


  userData.forEach(user => {
    if (!(user.school in uniDict)){
      console.log(user)
    }
    
    const schoolLat = uniDict[user.school].latitude
    const schoolLng = uniDict[user.school].longitude
    

    user.latitude = generateRandomCoordinates(schoolLat, schoolLng).latitude;
    user.longitude = generateRandomCoordinates(schoolLat, schoolLng).longitude;


  })
  console.log(userData[0])

  const seedDatabase = async () => {
      try {
      await sequelize.sync({ alter: true });
      console.log("Database synchronized");

      // Insert sample data into the database
      await User.bulkCreate(userData);
      console.log("Sample data inserted");

      process.exit(0);
    } catch (error) {
      console.error("Error seeding data:", error);
      process.exit(1);
    }
    };

    seedDatabase();

  });
  
  





