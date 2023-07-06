import { Link } from 'react-router-dom'

import './Login.css'


export default function (){
    return(
    <div className='main'>


        <div>
           <h1>Welcome Back to the Tutorverse</h1>
           <h4>We missed you</h4>
        </div>
        <div className='login-form'>
            <h3>Login Here</h3>
            <input type="text" label="Email Address" id="login-email" aria-label='Email address'/>
            <input type="text" label="Password" id="login-password" aria-label='Password' />
            <button className='login-btn'>
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