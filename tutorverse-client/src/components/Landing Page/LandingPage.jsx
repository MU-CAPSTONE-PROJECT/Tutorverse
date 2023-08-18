import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import SchoolIcon from '@mui/icons-material/School';
import MenuIcon from '@mui/icons-material/Menu';
import "./LandingPage.css";

export default function LandingPage() {


  const navigate = useNavigate();

  const getStartedBtn = () =>{
    navigate("/pick_role")
  }
  const loginBtn = () => {
    navigate("/login")
  }
  return (
    <div>
      <div className="landing-navbar">
        <div className="left">
          <div className="logo">
            <SchoolIcon/>
          </div>
          <div> <h3>TutorVerse </h3></div>
        </div>
        <div className="right">
          <Button 
            className="login-btn" 
            variant="contained"  
            onClick={loginBtn}
            style={{backgroundColor:'#F59525'}}
            >
            Login
          </Button>
          <MenuIcon/>
        </div>
      </div>
      <div className="landing-body">
        <div className="intro1">
          <img src="./src/assets/tutoring.jpg" alt="display image"/>
          <div className="intro-text">
            <h2>
              Welcome to the TutorVerse
            </h2>
          </div>
        </div>
      </div>
      <div className="get-started-btn">
        <Button 
          className="btn" 
          variant="contained" 
          onClick={getStartedBtn}
          style={{backgroundColor:'#F59525'}}
          >
            Get Started
        </Button>
        
      </div>
    </div>
  );
}
