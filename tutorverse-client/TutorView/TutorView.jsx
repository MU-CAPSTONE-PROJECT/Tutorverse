import TutorCard from '../src/components/TutorCard/TutorCard';
import { useParams } from 'react-router-dom'
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';
import { useEffect } from 'react';

import './TutorView.css'


export default function TutorView(){
    const [tutor, setTutor] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { tutorId } = useParams();

    useEffect(() => {
        const fetchTutor = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/tutor/${tutorId}`);
            setTutor(response.data.data);
            console.log(tutor)
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
        };

        fetchTutor();
    }, [tutorId]);

    const {id, firstName, lastName, emailAddress, imageUrl, major, school } = tutor;

    return (
        <div className='tutor-view'>
            <div className='nav-bar'>
                <div className="left">
                <div className="logo">
                    <img src="./src/assets/educate-svgrepo-com.svg" alt="" />
                </div>
                <div>Tutorverse</div>
                </div>
                <div className="right">
                <div>
                    Login
                </div>
                <div>
                    Menu
                    Hamburger
                </div>
            </div>
            </div>

            <div className='tutor-details'>
                <div>
                    <div className='top'>
                        <div className='profile-avatar'>
                            <Avatar 
                                alt="Profile Image" 
                                src="tutorverse-client/src/assets/profile.jpg"
                                sx={{ width: 100, height: 100 }}
                            />
                        </div>
                        <div className='title'>
                            <div className='name-label'>
                                {firstName} {lastName}
                            </div>
                            <div className='major-label'>
                                {major}
                            </div>

                        </div>
                        

                    </div>
                </div>
            </div>



        </div>
    )



}