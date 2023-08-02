import { useNavigate } from "react-router-dom";
import "./SelectRole.css";

export default function SelectRole({ userRole, setUserRole }) {

  const navigate = useNavigate()

  const setStudent = () => {
    setUserRole("student");
  };
  const setTutor = () => {
    setUserRole("tutor");
  };

  const handleClick = () => {
    if(userRole==="student"){
      navigate('/pick_school')
    } else if(userRole==="tutor"){
      navigate('/courses_taken')
    } else{
      alert("Please select your role!")
    }
  };

  return (
    <div>
      <div className="navbar"></div>
      <div>
        <div>Enter the Tutorverse</div>
        <div className="role-buttons">
          <button className="student-role-btn" onClick={setStudent}>
            I am a student
          </button>
          <button className="tutor-role-btn" onClick={setTutor}>
            {" "}
            I am a tutor
          </button>
        </div>
      </div>
      <div className="join-now">
          Let's find you a cool tutor
          <button onClick={handleClick}> Next </button>
      </div>
    </div>
  );
}
