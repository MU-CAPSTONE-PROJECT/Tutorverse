import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './StudentHome.css'
import { useEffect , useState } from "react";
 
export default function StudentHome({
    userInfo,
    userRole
}){

    ///Replace with components for tutor view and student view
    if (userRole==='tutor'){
        return (
        <div>
            WELCOME, {userInfo.firstName} 
            <p> This is your tutor dashboard</p> 
        </div>
        )
    }
    else{
        return (
            <div>
                WELCOME, {userInfo.firstName} 
                <p> This is your student dashboard</p> 
            </div>
        )
    }
    
    

};