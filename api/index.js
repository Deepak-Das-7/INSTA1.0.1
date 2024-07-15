const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const story = require('./routes/story');
const posts = require('./routes/posts');
const profile = require('./routes/profile');
const request = require('./routes/request');
const messages = require('./routes/messages');
const auth = require('./routes/auth');
const user = require('./routes/user');

const app = express();
app.use(cors());
const port = 8000;
const mongoUri = "mongodb+srv://DeepakDas:ashutosh82@cluster0.ll96sxh.mongodb.net/Instagram?retryWrites=true&w=majority";
// const mongoUri = "mongodb://localhost:27017/test";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });

app.listen(port, () => {
  console.log("Server is running on port", port);
});

// Route error handling
const routes = [
  { path: '/story', route: story },
  { path: '/posts', route: posts },
  { path: '/profile', route: profile },
  { path: '/request', route: request },
  { path: '/messages', route: messages },
  { path: '/auth', route: auth },
  { path: '/user', route: user },
];

routes.forEach(({ path, route }) => {
  app.use(path, route);
  app.use(path, (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.status = 404;
    next(error);
  });
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});
