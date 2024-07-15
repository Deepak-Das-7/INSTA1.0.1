const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require('http');
const socketIo = require('socket.io');
const socketEvents = require('./socket');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 8000;
const mongoUri = "mongodb://localhost:27017/test";

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });

// Attach socket.io instance to req.app
app.io = io;

// Initialize socket.io events
socketEvents(io);

// API routes setup
const routes = require('./routes');
app.use('/', routes);

// Error handling middleware
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
