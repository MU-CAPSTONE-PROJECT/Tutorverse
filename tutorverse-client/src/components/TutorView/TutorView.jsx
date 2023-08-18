import { useParams , useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { UserContext } from "../../../../userContext";
import SchoolIcon from '@mui/icons-material/School';
import MenuIcon from '@mui/icons-material/Menu';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import Button from '@mui/material/Button';
import Avatar from "@mui/material/Avatar";
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import axios from "axios";
import { useEffect } from "react";

import "./TutorView.css";

export default function TutorView() {
  const [tutor, setTutor] = useState({});
  const { tutorId } = useParams();
  const [isLoading, setIsLoading] =useState(true)
  const { user , updateUser} = useContext(UserContext);
  const navigate = useNavigate();
  const [value,setValue] = useState(0)
  const [rating, setRating] = useState(0)

  const { firstName, lastName, major } = tutor;

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleRatingSubmit = () => {
    handleClose();
    setRating(value)
    setValue(value)
  }

  console.log(tutor.rating)
  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/tutor/${tutorId}`,
        );
        setTutor(response.data.data);
        setIsLoading(false)
        
        setValue(tutor.rating)
      } catch (error) {
        console.log(error);
      }
    };

    fetchTutor();
  },[ rating]);

  useEffect(() => {
    const saveRating = async  () => {
      try {
        const studentId = user.id
        if(!(rating===null) && rating>0){
          const response = await axios.post(
          "http://localhost:3000/ratings",
          {
            tutorId,
            rating: value,
            studentId
          }
        )
        console.log(response)
        }
      } catch (error){
        console.log(error)
      }
    };
    saveRating();
  }, [rating])
  
  const handleMessageBtn =()=>{
    navigate(`/chat/${tutorId}`);
  }

  const handleLogout = () => {
    updateUser(null);
  };

  const chatBtnClick = () =>{
    navigate('/chat')
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  if(isLoading){
    return (
    <div>
    Loading...
    </div>)
  } else{
    return (
    <div className="tutor-view">
    <div className="student-nav">
        <div className="left">
          <div className="logo">
            <SchoolIcon color="#F59525"/>
          </div>
          <div>Tutorverse</div>
        </div>
        <div className="right">
          <ChatBubbleIcon onClick={chatBtnClick}/>
          <Button 
           variant="contained" 
           onClick={handleLogout} 
           sx={{backgroundColor: '#F59525', borderRadius:'10px'}}
           >Logout</Button>
          <MenuIcon/>
        </div>
      </div>

    <div className="tutor-details">
      <div>
        <div className="top">
          <div className="profile-avatar">
            <Avatar
              alt="Profile Image"
              src="tutorverse-client/src/assets/profile.jpg"
              sx={{ width: 100, height: 100 }}
            />
          </div>
          <div className="title">
            <div className="name-label">
              <h2>
                {firstName} {lastName}
              </h2>
            </div>
            <div className="major-label">{major}</div>

          </div>
          <div className="rating">
            <Box sx={{ '& > legend': { mt: 2 },}}>
              <Typography component="legend">{tutor.rating}</Typography>
              <Rating name="read-only" value={tutor.rating} precision={0.5} readOnly />
            </Box>
          </div>
        </div>
        <div className="rate-modal">
          <Button onClick={handleOpen}>Rate</Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
            <Typography component="legend">Rating</Typography>
              <Rating
                name="simple-controlled"
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
              />
              <Button className="submit-rating" onClick={handleRatingSubmit}>Submit</Button>
            </Box>
          </Modal>
        </div>
      </div>
    </div>
    <div className="message-btn">
      <Button onClick={handleMessageBtn}>
        Message
      </Button>
    </div>
  </div>
  )}
    
}
