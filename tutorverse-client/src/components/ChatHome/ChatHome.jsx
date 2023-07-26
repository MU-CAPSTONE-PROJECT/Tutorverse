import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Button from "@mui/material/Button";
import "./ChatHome.css";

const messageList = [];
export default function ChatHome({ socket, studentId, tutorId }) {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  // Sending a message
  const handleSend = () => {
    if (message.trim() !== "") {
      messageList.push({ user: 0, text: message });
      console.log(messageList);
      const privateRoom = `${studentId}-${tutorId}`; // Generate a unique room name
      socket.emit("receiving message", {
        content: message,
        to: 16,
        room: privateRoom,
      });
      setMessage("");
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  // Receiving a message
  useEffect(() => {
    if (socket) {
      console.log("Listening for private message");
      socket.on("private message", ({ content, from }) => {
        console.log(content, from);
        messageList.push({ user: 1, text: content });
        console.log(messageList);
      });
    }
  }, [socket]);

  return (
    <div className="main">
      <div className="chat-navbar">
        <div className="icon" onClick={handleBackClick}>
          <ArrowBackIosIcon />
        </div>
      </div>
      <div>CHATS</div>
      <div className="body">
        <div className="side-nav"></div>
        <div className="chat-window">
          <div className="chat-body">
            {messageList.map((msg, index) => (
              <div
                key={index}
                className={`message-${msg.user === 0 ? "sent" : "received"}`}
              >
                <p>{msg.text}</p>
              </div>
            ))}
          </div>
          <div className="send-message">
            <TextField
              className="message-input"
              value={message}
              id="outlined-basic"
              label="Text Message"
              variant="outlined"
              size="small"
              onChange={handleInputChange}
            />
            <Button
              className="send-btn"
              variant="contained"
              onClick={handleSend}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
