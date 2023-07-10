import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import './Register.css';

export default function  Register() {
  const [firstName, setFirstName]  = useState('');
  const [lastName, setLastName] = useState('');
  const [emailAddress, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegisterSubmit = async () => {

    try {
      const response = await axios.post('http://localhost:3000/signup', {
        firstName,
        lastName,
        emailAddress,
        password,
      });
      console.log(response.data);
      console.log("Success!");
    } catch (error) {
      console.error(error);
      console.log("Failure!");
    }
  };

  return (
    <div className='main'>
      <div>
        <div className='left'>
          Get your free pass into the TutorVerse
          <div>Let's find you a cool tutor</div>
        </div>
        <div className='right'>
          <div className='signup-form'>
            Sign up here
            <input
              type='text'
              label='First Name'
              id='firstname-input'
              aria-label='name input'
              placeholder='enter first name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type='text'
              label='Last Name'
              id='lastname-input'
              aria-label='name input'
              placeholder='enter last name'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type='text'
              label='Email Address'
              id='email-input'
              aria-label='email input'
              placeholder='enter email'
              value={emailAddress}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type='password'
              label='Create Password'
              id='password-input'
              aria-label='password input'
              placeholder='enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type='password'
              label='Confirm Password'
              id='confirm-password'
              aria-label='confirm password'
              placeholder='confirm password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button className='register-btn' onClick={handleRegisterSubmit}>
              Register
            </button>
            <p>
              Existing user?{' '}
              <Link to={'/login'}>
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
