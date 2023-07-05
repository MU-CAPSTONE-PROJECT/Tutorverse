import './Register.css'

export default function(){
    <div className='main'>

        <div>
            <div className='left'>
                Get your free pass into the TutorVerse
                <div>Let's find you a cool tutor</div>
            </div>
            <div className='right'>
                <div className='signup-form'>
                    Sign up here
                    <input type="text" label="Full Name" id="name-input" aria-label='name input'/>
                    <input type="text" label="Email Address" id="email-input" aria-label='email input' />
                    <input type="password" label="Create Password" id="password-input" aria-label='password input' />
                    <input type="password" label="Confirm Password" id="confirm-password" aria-label='confirm password'/>
                    <button className='register-btn'>
                        Register Now
                    </button>
                    <p>Existing user? Login</p> 
                </div>
            </div>
        </div>
        

    </div>
}