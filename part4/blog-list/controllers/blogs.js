const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (req, res, next) => {
  try {
    const blogs = await Blog.find({});
    res.json(blogs.map(blog => blog.toJSON()));
  } catch (e) {
    next(e);
  }
});

blogsRouter.post("/", async (req, res, next) => {
  const { body } = req;

  const blog = new Blog({
    title: body.title,
    author: body.author || "",
    url: body.url,
    likes: body.likes || 0
  });

  try {
    const savedBlog = await blog.save();
    res.status(201).json(savedBlog.toJSON());
  } catch (e) {
    next(e);
  }
});

module.exports = blogsRouter;
