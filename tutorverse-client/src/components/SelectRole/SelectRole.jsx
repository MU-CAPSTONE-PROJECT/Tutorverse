import { Link } from 'react-router-dom';

import './SelectRole.css'



export default function SelectRole(){
    return(
    <div>
        <div className='navbar'>
            
        </div>
        <div>
            <div>Enter the Tutorverse</div>
            <div className='role-buttons'>
                <button className='student-role-btn' >I am a student</button>
                <button className='tutor-role-btn'> I am a tutor</button>
            </div>

        </div>
        <div className='join-now'>
            Let's find you a cool tutor
            <Link to={'/pick_school'}>
                <button> Join now</button>
            </Link>
            
        </div>
    </div>
    );
}