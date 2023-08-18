import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import "./SelectRole.css";

export default function SelectRole({ userRole, setUserRole }) {

  const navigate = useNavigate()

  const handleNextBtn = () => {
    if(userRole==="student"){
      navigate('/pick_school')
    } else if(userRole==="tutor"){
      navigate('/courses_taken')
    } else{
      alert("Please select your role!")
    }
  };
  
  

  const handleRoleSelection = (role) => {
    setUserRole(role === role ? role : null)
  };

  return (
    <div className="container">
      
      <div className="content">
        <div className="title"> 
          <h3> Welcome to the</h3>
          <h2 className="tutorverse"> TutorVerse </h2>
        </div> 
        
        <div className="role-buttons">
          <Button
            className={`role-btn student-btn ${userRole === 'student' ? 'selected' : ''}`}
            onClick={() => handleRoleSelection('student')}
          >
            I am a student
          </Button>
          <Button
            className={`role-btn tutor-btn ${userRole === 'tutor' ? 'selected' : ''}`}
            onClick={() => handleRoleSelection('tutor')}
          >
            I am a tutor
          </Button>
        </div>
        <div className="join-now">
          {userRole ? (
            <>
              
              <Button className="next-btn" onClick={handleNextBtn}>Next</Button>
            </>
          ) : (
            <p>Please select your role to continue.</p>
          )}
        </div>
      </div>
    </div>
  );
}
