import React from "react";
import Avatar from '@mui/material/Avatar';
import './TutorCard.css'
import { Link } from "react-router-dom";


export default function TutorCard ({tutor}){

    //destructing the tutor properties
    const { id, firstName, lastName, emailAddress, major, school, imageUrl} = tutor

    return (
        <div className="tutor-card">
            <Link to={`/tutor/${id}`}>
            
                <div className="card-content">
                    <div className="left">
                        <div className="profile-img" >
                            <Avatar 
                            className="avatar"
                                alt="Profile Image" 
                                src={imageUrl}
                                sx={{ width: 100, height: 100 }}
                                />
                        </div>
                    </div>
                    <div className="middle">
                        <div className="name-label">{firstName}  {lastName}</div>
                        <div className="major-label">{major}</div>
                        <div className="about-text">Hello. I am an example tutor. Click on me to see more</div>
                    </div>
                    <div className="right">
                        <div className="rating">⭐️⭐️⭐️⭐️⭐️ 5.0</div>
                        <div className="status-flag">Available </div>
                    </div> 
                </div>
            </Link>
            
           


        </div>
    )
}