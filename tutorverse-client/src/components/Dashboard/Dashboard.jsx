import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../../userContext";
import axios from "axios";
import StudentHome from "../StudentHome/StudentHome";
import TutorHome from "../TutorHome/TutorHome";
import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useContext(UserContext);
  const [location, setLocation] = useState(null);
  console.log(user.firstName);

  //Geolocation
  useEffect(()=> {
  if (navigator.geolocation || location===null){
      const fetchLocation = () =>{
          navigator.geolocation.watchPosition(success, error);
      }; 
      fetchLocation();
      
  } else {
      console.log("No Geolocation");
  }
  },[location])
  console.log(location);

  function success (position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLocation({latitude, longitude});

    //POST request to save location data to database
    if (!(location===null)){
      
      try{
        const saveLocation = async ()=>{

        const response = await axios.post("http://localhost:3000/save/location",
            {
                location
            }, {
                withCredentials:true
        })
          console.log(response.data.message)
        } 
        saveLocation();
      } catch (error){
            console.log(error);
        }
    }
  }

  function error(){
    console.log("Failed to retrieve location data")
  }

  if (user.userRole === "tutor") {
    return (
      <div className="tutor-home">
        <TutorHome />
      </div>
    );
  } else {
    return (
      <div className="student-home">
        <StudentHome />
      </div>
    );
  }
}
