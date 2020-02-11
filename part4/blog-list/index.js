// const http = require("http");
const express = require("express");

const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const config = require("./utils/config");

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
});

const Blog = mongoose.model("Blog", blogSchema);

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(cors());
app.use(bodyParser.json());

app.get("/api/blogs", (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs);
  });
});

app.post("/api/blogs", (request, response) => {
  console.log(request.body);
  const blog = new Blog(request.body);

  blog.save().then(result => {
    response.status(201).json(result);
  });
});

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});