import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Button from "@mui/material/Button";
import socketIO from "socket.io-client";
import "./ChatHome.css";

export default function ChatHome({ user }) {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  //Fetching chat list for both tutor and student user
  useEffect(() => {
    const fetchChats = async () => {
      const response = await axios.get("http://localhost:3000/chatlist",
      {
        withCredentials: true,
      }
      );
      setChats(response.data)
    };
    fetchChats();
    console.log(chats)

  }, [])

  useEffect( () => {
    const fetchMessages = async () => {
      const response = await axios.get("http://localhost:3000/messages",
      {
        withCredentials: true,
      } 
      );
      setMessages(response.data);
    };
    fetchMessages();
  },[newMessage])

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

        setNewMessage("");
      }
    } else {
      if (messages && newMessage) {
        socket.emit("sendMessage", {
          fromId: user.id,
          toId: messages[0].senderId,
          content: newMessage,
        });

        setNewMessage("");
      }
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };


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
          {
            chats.map((chat) => (
              <div key={chat.id} onClick={() => setSelectedUser(chat)}>
                {chat.firstName}
              </div>
            ))
          }
        </div>
        <div className="chat-window">
          <div className="chat-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message-${
                  msg.senderId === user.id ? "sent" : "received"
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
