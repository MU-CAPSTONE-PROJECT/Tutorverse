import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Button from "@mui/material/Button";
import socketIO from "socket.io-client";
import "./ChatHome.css";

export default function ChatHome({ user }) {
  const [tutors, setTutors] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  //GET request for tutorlist
  useEffect(() => {
    const fetchTutors = async () => {
      const response = await axios.get("http://localhost:3000/tutors", {
        withCredentials: true,
      });
      setTutors(response.data.list);
      console.log(response.data.list);
    };
    fetchTutors();
  }, []);

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    if (user) {
      socketIO.auth = { userId: user.id };
      console.log(user.id);

      const newSocket = socketIO("http://localhost:4000", {
        auth: { userId: user.id },
      });
      setSocket(newSocket);
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      //Listener for receiving messages
      socket.on("privateMessage", (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      return () => {
        socket.off("privateMessage");
      };
    }
  });

  //Sending message
  const sendMessage = () => {
    if (user.userRole === "student") {
      if (selectedUser && newMessage) {
        socket.emit("sendMessage", {
          fromId: user.id,
          toId: selectedUser.id,
          content: newMessage,
        });
        console.log(newMessage);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            fromId: user.id,
            content: newMessage,
            timestamp: Date.now(),
          },
        ]);

        setNewMessage("");
      }
    } else {
      if (messages && newMessage) {
        socket.emit("sendMessage", {
          fromId: user.id,
          toId: messages[0].fromId,
          content: newMessage,
        });
        console.log(messages[0].fromId);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            fromId: user.id,
            content: newMessage,
            timestamp: Date.now(),
          },
        ]);

        setNewMessage("");
      }
    }
  };
  console.log(messages);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  console.log(selectedUser);

  return (
    <div className="main">
      <div className="chat-navbar">
        <div className="icon" onClick={handleBackClick}>
          <ArrowBackIosIcon />
        </div>
      </div>
      <div>CHATS</div>
      <div className="body">
        <div className="side-nav">
          {user.userRole === "student" ? (
            tutors.map((tutor) => (
              <div key={tutor.id} onClick={() => setSelectedUser(tutor)}>
                {tutor.firstName}
              </div>
            ))
          ) : (
            <div></div>
          )}
        </div>
        <div className="chat-window">
          <div className="chat-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message-${
                  msg.fromId === user.id ? "sent" : "received"
                }`}
              >
                <p>{msg.content}</p>
              </div>
            ))}
          </div>
          <div className="send-message">
            <TextField
              className="message-input"
              value={newMessage}
              id="outlined-basic"
              label="Text Message"
              variant="outlined"
              size="small"
              onChange={handleInputChange}
            />
            <Button
              className="send-btn"
              variant="contained"
              onClick={sendMessage}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
