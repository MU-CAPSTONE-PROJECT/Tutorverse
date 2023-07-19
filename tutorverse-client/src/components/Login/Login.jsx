import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useState, useContext } from "react";
import { UserContext } from "../../../../userContext";
import "./Login.css";

export default function Login() {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setpassword] = useState("");
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLoginSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/user/login",
        {
          emailAddress,
          password,
        },
        {
          withCredentials: true,
        },
      );
      console.log(response);
      if (response.status === 200) {
        const data = response.data;
        const loggedInUser = data.user;

        //user context
        updateUser(loggedInUser);

        //Navigate to home
        navigate("/dashboard");
        console.log("Login Success!");
      } else {
        //Handle login failure
        alert("Login failed");
      }
    } catch (error) {
      console.error(error);
      console.log("Login Failure!");
      alert("Login Failed: " + error);
    }
  };

  return (
    <div className="main">
      <div>
        <h1>Welcome Back to the Tutorverse</h1>
        <h4>We missed you</h4>
      </div>
      <div className="login-form">
        <h3>Login Here</h3>
        <input
          type="text"
          label="Email Address"
          id="login-email"
          aria-label="Email address"
          placeholder="email address"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
        />

        <input
          type="password"
          label="Password"
          placeholder="password"
          id="login-password"
          aria-label="Password"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
        />
        <button className="login-btn" onClick={handleLoginSubmit}>
          Login
        </button>
        <div>
          <p>New User?</p>
          <Link to="/register">
            <p>Register</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
