const express = require('express');
const app = express();
const PORT = 4000;
const http = require('http').Server(app);
const cors = require('cors');
const { User, sequelize, Message } = require('./data.js');

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:5173"
    }
});

app.use(cors());
const userSocketIds = {};

//Socket connection
socketIO.on('connection', (socket) => {
  
  console.log('New user connected: ' , socket.id);
  const userId = socket.handshake.auth.userId;
  socket.userId = userId;

  if (userId) {
    //Check is user exists in DB
    User.findByPk(userId)
      .then((user) => {
        if (!user) {
          console.log("Invalid user ID. Disconnecting socket.");
          socket.disconnect(true);
        } else {
          if (!userSocketIds[userId]) {
            userSocketIds[userId] = new Set();
          }
          userSocketIds[userId].add(socket.id);
        }
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        socket.disconnect(true);
      });
  }

  //Incoming messages
  socket.on('sendMessage',async (message) => {
    const {fromId, toId, content} = message;
    console.log(message)
    const socketIDs = userSocketIds[toId]
    
    await Message.create({
      senderId: fromId,
      recepientId: toId,
      content: content
    })


    if (socketIDs){
      socketIDs.forEach((socketId)=>{

        console.log("Sending message to", socketId)

        socket.to(socketId).emit("privateMessage", {
        content,
        fromId: socket.userId,
      });
      });
    }

    //TODO Store message in DB
    
    //
    if (userSocketIds[userId]) {
      userSocketIds[userId].forEach((socketId) => {
        if (socketId !== socket.id) {
          socket.to(socketId).emit("privateMessage", {
            content,
            fromId: userId,
          });
        }
      });
    }
    
  });
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Clean up disconnected socket.id from userSocketIds
    for (const [userId, socketIds] of Object.entries(userSocketIds)) {
      if (socketIds.has(socket.id)) {
        socketIds.delete(socket.id);
        if (socketIds.size === 0) {
          delete userSocketIds[userId];
        }
        break;
      }
    }
  });

})
app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

http.listen(PORT, () => {
  console.log(`Socket.IO Server listening on ${PORT}`);
});