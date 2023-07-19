import axios from "axios";
import { useEffect, useState } from "react";
import TutorCard from "../TutorCard/TutorCard";
import { useContext } from "react";
import { UserContext } from "../../../../userContext";
import MapView from "../MapView/MapView";
import "./StudentHome.css";

export default function StudentHome() {
  const { user } = useContext(UserContext);
  const [tutors, setTutors] = useState([]);
  const [location, setLocation] = useState(null);


  useEffect(() => {
    const fetchTutors = async () => {
      const response = await axios.get("http://localhost:3000/tutors", {
        withCredentials: true,
      });
      setTutors(response.data.list);
      console.log(response.data.list);
    };
    fetchTutors();
  }, []);

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
    
  }

  function error(){
    console.log("Failed to retrieve location data")
  }

  return (
    <div className="student-dash">
      <div className="student-nav">
        <div className="left">
          <div className="logo">
            <img src="./src/assets/educate-svgrepo-com.svg" alt="" />
          </div>
          <div>Tutorverse</div>
        </div>
        <div className="right">
          <div>Login</div>
          <div>Menu Hamburger</div>
        </div>
      </div>
      <h3>Welcome, {user.firstName}</h3>

      <div className="tutor-view">
        <div className="tutor-list">
          {tutors.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
        <div className="tutor-map">
          <MapView />
        </div>
      </div>
    </div>
  );
}
