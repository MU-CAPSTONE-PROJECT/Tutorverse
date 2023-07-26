import { useContext } from "react";
import { UserContext } from "../../../../userContext";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import SchoolIcon from '@mui/icons-material/School';
import MenuIcon from '@mui/icons-material/Menu';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

export default function TutorHome() {
  const navigate = useNavigate();
  const { user, updateUser } = useContext(UserContext);

  const chatBtnClick = () =>{
    navigate('/chat')
  }
  const handleLogout = () => {
    updateUser(null);
  };

  return (
  <div className="tutor-dash">
    <div>
      <h3>
        WELCOME, {user.firstName}
        </h3>
    </div>
    
    <div className="tutor-nav">
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
  </div>
)}
