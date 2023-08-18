// import React from "react";
import Avatar from "@mui/material/Avatar";
import "./TutorCard.css";
import { Rating } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function TutorCard({ tutor }) {
  //destructing the tutor properties
  const { id, firstName, lastName, major } =
    tutor;
 
  console.log(tutor.activeStatus)
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate(`/tutor/${id}`)
  }

  return (
    <div className="tutor-card">
      
      <div className="card-content" onClick={handleCardClick}>
        <div className="left">
          <div className="profile-img">
            <Avatar
              className="avatar"
              alt="Profile Image"
              src="./src/assets/profile.jpg"
              sx={{ width: 80, height: 80 }}
            />
          </div>
        </div>
        <div className="middle">
          <div className="name-label">
             <h3>{firstName} {lastName} </h3>
          </div>
          <div className="major-label"> <h4> {major} </h4></div>
          <div className="about-text">
          </div>
        </div>
        <div className="right">
          <div> {tutor.score}% match</div>
          <div className="rating">{tutor.rating} </div>
          <Rating name="read-only" value={tutor.rating} precision={0.5} readOnly /> 
          <div className={tutor.activeStatus===1 ? 'active' : 'not-active'}> {tutor.activeStatus===1 ? 'Active' : ''}</div>
        </div>
      </div>
      
    </div>
  );
}
