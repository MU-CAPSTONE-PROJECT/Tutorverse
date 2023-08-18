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
import Chip from '@mui/material/Chip';
import MapView from "../MapView/MapView";
import "./StudentHome.css";

export default function StudentHome() {
  const { user, updateUser } = useContext(UserContext);
  const [tutors, setTutors] = useState([]);
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState('recommended');
  const filters = ['recommended', 'all', 'active', 'under 2 miles away'];

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 180000);

    return () => clearInterval(interval);
  }, []);

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    fetchTutors(filter);
  };

  //GET request for tutorlist
  const fetchTutors = async (filter) => {
    try {
      const response = await axios.get(`http://localhost:3000/tutors/${filter}`, {
        withCredentials: true,
      });
      setTutors(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching tutors:", error);
    }
  };
  
  //Initial fetch for default recommended filter
  useEffect(() => {
    fetchTutors(selectedFilter)
  }, [time, selectedFilter]);



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
            <SchoolIcon color="#F59525"/>
          </div>
          <div>Tutorverse</div>
        </div>
        <div className="right">
          <ChatBubbleIcon onClick={chatBtnClick}/>
          <Button 
           variant="contained" 
           onClick={handleLogout} 
           sx={{backgroundColor: '#F59525', borderRadius:'10px'}}
           >Logout</Button>
          <MenuIcon/>
        </div>
      </div>
      <h3>Hi, {user.firstName}!</h3>
      
      <div>
        {filters.map((filter) => (
            <Chip
              key={filter}
              label={filter}
              color={selectedFilter === filter ? 'primary' : 'default'}
              onClick={() => handleFilterSelect(filter)}
              style={{ margin: '4px', backgroundColor: selectedFilter===filter ? '#F59525' : 'white' }}
            />
          ))}
      </div>
      <div className="tutor">
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
