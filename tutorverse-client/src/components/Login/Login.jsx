import { Link } from 'react-router-dom'
import axios from 'axios';
import { useState } from 'react';
import './Login.css'


export default function Login(){

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setpassword] = useState('');

    const handleLoginSubmit = async () => {

        try {
            const response = await axios.post('http://localhost:3000/login', {
                emailAddress,
                password,
            });
            console.log("Login Success!");
        } catch (error) {
            console.error(error);
            console.log("Login Failure!");
        }
    }

    return(
    <div className='main'>


        <div>
           <h1>Welcome Back to the Tutorverse</h1>
           <h4>We missed you</h4>
        </div>
        <div className='login-form'>
            <h3>Login Here</h3>
            <input 
            type="text" 
            label="Email Address" 
            id="login-email" 
            aria-label='Email address'
            placeholder='email address'
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            />

            <input 
            type="text" 
            label="Password" 
            placeholder='password'
            id="login-password" 
            aria-label='Password' 
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            />
            <button 
            className='login-btn' 
            onClick={handleLoginSubmit}
            >
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
    )
}