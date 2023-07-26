const express = require('express');
const app = express();
const PORT = 4000;
const http = require('http').Server(app);
const cors = require('cors');
const { User, sequelize } = require('./data.js');

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:5173"
    }
});

app.use(cors());

const socketUser = {};

socketIO.on('connection', (socket) => {
    socket.join(socket.id)

    console.log(`⚡: ${socket.id} user just connected!`);
    console.log(socket.handshake.auth)
    const userId = socket.handshake.auth.userId
    socket.userId = userId

    if (userId){

      if (socketUser[userId]==null){
        socketUser[userId] = new Set()
      }
      socketUser[userId].add(socket.id)  
    }
    //Receiving a message
    socket.on("receiving message", ({content, to}) => {
      const socketIDs = socketUser[to]
      console.log("receiving message", content,to)
      console.log(socketIDs)

      if (socketIDs){
        socketIDs.forEach((socketId)=>{

          console.log("Sending message to", socketId)
          socket.to(socketId).emit("private message", {
          content,
          from: userId,
       })
        })
      }
      })
    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
    });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});