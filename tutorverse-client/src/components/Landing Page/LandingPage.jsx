import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div>
      <div className="landing-navbar">
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
      <div className="landing-body">
        <div className="intro1">
          <img src="./src/assets/tutoring.jpg" alt="display image" />
        </div>
      </div>
      <div>
        <Link to={"/pick_role"}>
          {/* <button className="get-started-btn"> Get Started</button> */}
          <Button variant="contained">Get Started</Button>
        </Link>
      </div>
    </div>
  );
}
