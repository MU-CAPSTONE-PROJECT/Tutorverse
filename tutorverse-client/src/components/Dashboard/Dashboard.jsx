import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { UserContext } from "../../../../userContext";
import StudentHome from '../StudentHome/StudentHome'
import TutorHome from '../TutorHome/TutorHome'
import './Dashboard.css'
import { useEffect , useState } from "react";
 
export default function Dashboard({
    userInfo,
    userRole,
    userData
}){
    const { user, updateUser } = useContext(UserContext);
    const navigate = useNavigate();
    console.log(user.firstName);
   
    if (userInfo.userRole==='tutor'){
        return (
            <div>

                
                <TutorHome userInfo={userInfo} userRole={userRole}/>
            </div>
            
        )
    }
    else{
        return (
            <div className="student-home">
                <StudentHome userInfo={userInfo} userRole={userRole}/>
            </div>
            
        )
    }
    
    

};