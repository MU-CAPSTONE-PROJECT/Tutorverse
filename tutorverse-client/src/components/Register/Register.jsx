import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../../../userContext";
import "./Register.css";

export default function Register({ school, userRole, coursesTaken, coursesOffered }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const handleRegisterSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/user/signup",
        {
          firstName,
          lastName,
          emailAddress,
          password,
          userRole,
          school,
          coursesTaken,
          coursesOffered
        },
        {
          withCredentials: true,
        },
      );
      console.log(userRole, school);
      if (response.status === 201) {
        const data = response.data;
        const loggedInUser = data.newUser;

        console.log(data);
        console.log("Signup Success!");

        //reset form fields
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        //Update user
        updateUser(loggedInUser);

        //navigate to dashboard
        navigate("/dashboard");
      } else {
        //Signup failure error
        alert("Signup Failed!");
      }
    } catch (error) {
      console.error(error);
      alert("Signup Failure! Error: " + error);
    }
  };

  return (
    <div className="main">
      <div>
        <div className="left">
          Get your free pass into the TutorVerse
          <div>Let's find you a cool tutor</div>
        </div>
        <div className="right">
          <div className="signup-form">
            Sign up here
            <input
              type="text"
              label="First Name"
              id="firstname-input"
              aria-label="name input"
              placeholder="enter first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              label="Last Name"
              id="lastname-input"
              aria-label="name input"
              placeholder="enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type="text"
              label="Email Address"
              id="email-input"
              aria-label="email input"
              placeholder="enter email"
              value={emailAddress}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              label="Create Password"
              id="password-input"
              aria-label="password input"
              placeholder="enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              label="Confirm Password"
              id="confirm-password"
              aria-label="confirm password"
              placeholder="confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button className="register-btn" onClick={handleRegisterSubmit}>
              Register
            </button>
            <p>
              Existing user? <Link to={"/login"}>Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
