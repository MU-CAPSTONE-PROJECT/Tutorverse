import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TutorCard from "../TutorCard/TutorCard";
import { useContext } from "react";
import { UserContext } from "../../../../userContext";
import Button from '@mui/material/Button';
import SchoolIcon from '@mui/icons-material/School';
import MenuIcon from '@mui/icons-material/Menu';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import MapView from "../MapView/MapView";
import "./StudentHome.css";

export default function StudentHome() {
  const { user, updateUser } = useContext(UserContext);
  const [tutors, setTutors] = useState([]);
  const [location, setLocation] = useState(null);
  const navigate = useNavigate();

    //GET request for tutorlist
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
  }

  function error(){
    console.log("Failed to retrieve location data")
  }

  //POST request to save location data to database
  const saveLocation = async ()=>{

    try{
        const response = await axios.post("http://localhost:3000/save/location",
            {
                location
            }, {
                withCredentials:true
        })
        console.log(response.data.message)
    } catch (error){
        console.log(error);
    }
  }; 
  saveLocation();
  const handleLogout = () => {
    updateUser(null);
  };

  const chatBtnClick = () =>{
    navigate('/chat')
  }
  
  return (
    <div className="student-dash">
      <div className="student-nav">
        <div className="left">
          <div className="logo">
            <SchoolIcon />
          </div>
          <div>Tutorverse</div>
        </div>
        <div className="right">
          <ChatBubbleIcon onClick={chatBtnClick}/>
          <Button variant="contained" onClick={handleLogout} >Logout</Button>
          <MenuIcon/>
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
            <MapView tutors={tutors}/>
        </div>
      </div>
    </div>
  );
}
