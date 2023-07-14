import axios from 'axios';
import { useEffect , useState} from 'react';
import TutorCard from '../TutorCard/TutorCard';
import { useContext } from "react";
import { UserContext } from "../../../../userContext";
import './StudentHome.css'



export default function StudentHome (){

    const { user } =useContext(UserContext); 
    const [tutors, setTutors] = useState([]);
    useEffect(()=>
    {
        const fetchTutors = async()=>{

            const response= await axios.get('http://localhost:3000/tutors',{withCredentials:true});
            setTutors(response.data.list)
            console.log(response.data.list)
        }; 
        fetchTutors();
        
    },[])

    return (
        <div className='Student-Dash'>
            <div className='student-nav'>
                <div className='logo'>

                </div>

            </div>
            <div className='tutor-list'>
                {tutors.map((tutor) =>(
                    <TutorCard 
                    key={tutor.id}
                    tutor ={tutor}
                    
                    />
                ))}

            </div>
        </div>
        
    )
}