const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require('http');
const port = 3000;
const env = require('../config');
const socketIo = require('socket.io');
const socketEvents = require('./sockets');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//==============DB connection========================
const mongoUri = env.MONGODB_URI_1;
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });

//======================================
const server = http.createServer(app);
const io = socketIo(server);
app.io = io;
socketEvents(io);
//======================================
const routes = require('./routes');
app.use('/', routes);

//==============Error handling middleware========================
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

server.listen(port, () => {
  console.log("Server is running on port", port);
});
