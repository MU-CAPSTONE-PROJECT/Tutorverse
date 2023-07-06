
import { Link } from 'react-router-dom';
import Login from '../Login/Login';
import './Register.css'

export default function(){

    return(
    <div className='main'>

        <div>
            <div className='left'>
                Get your free pass into the TutorVerse
                <div>Let's find you a cool tutor</div>
            </div>
            <div className='right'>
                <div className='signup-form'>
                    Sign up here
                    <input type="text" label="Full Name" id="name-input" aria-label='name input' placeholder='enter name'/>
                    <input type="text" label="Email Address" id="email-input" aria-label='email input' placeholder='enter email' />
                    <input type="password" label="Create Password" id="password-input" aria-label='password input' placeholder='enter password'/>
                    <input type="password" label="Confirm Password" id="confirm-password" aria-label='confirm password' placeholder='confirm password'/>
                    <button className='register-btn'>
                        Register
                    </button>
                    <p>Existing user? 
                        <Link to={'/login'}>
                            <p>Login</p>
                        </Link>
                    </p> 
                </div>
            </div>
        </div>
        

    </div>
    );
}