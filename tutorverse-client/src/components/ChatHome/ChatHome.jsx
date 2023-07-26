import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Button from '@mui/material/Button';
import './ChatHome.css'

export default function  ChatHome() {
    const navigate = useNavigate();

    const handleBackClick = () =>{
        navigate('/dashboard');
    }

    return(
        <div className='main'>
            <div className='chat-navbar'>
                <div className='icon' onClick={handleBackClick}>
                    <ArrowBackIosIcon />
                </div>
            </div>
            <div>
                CHATS
            </div>
            <div className='body'>

                <div className='side-nav'>

                </div>

                <div className='chat-window'>
                    <div className='chat-body'>

                    </div>
                    <div className='send-message'>
                        <TextField className='message-input' id="outlined-basic" label="Text Message" variant="outlined" size='small' />
                        <Button className='send-btn' variant="contained" >Send</Button>
                    </div>
                    
                </div>

            </div>
        </div>
    )
}