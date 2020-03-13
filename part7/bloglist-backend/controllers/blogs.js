const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const { ErrorHelper } = require("../utils/error_helper");
const User = require("../models/user");
const Blog = require("../models/blog");

blogsRouter.get("/", async (req, res, next) => {
  try {
    const blogs = await Blog.find({}).populate("user", {
      username: 1,
      name: 1,
    });
    res.json(blogs.map((blog) => blog.toJSON()));
  } catch (e) {
    next(e);
  }
});

blogsRouter.get("/:id", async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      res.json(blog.toJSON());
    } else {
      res.status(404).end();
    }
  } catch (e) {
    next(e);
  }
});

blogsRouter.post("/", async (req, res, next) => {
  const { body } = req;
  const { token } = req;

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    if (!token || !decodedToken.id) {
      throw new ErrorHelper(401, "Authentication Error", [
        "Invalid or missing authentication token",
      ]);
    }

    const user = await User.findById(decodedToken.id);

    const blog = new Blog({
      title: body.title,
      author: body.author || "",
      url: body.url,
      likes: body.likes || 0,
      user: user._id,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    await savedBlog
      .populate({ path: "user", select: ["name", "username"] })
      .execPopulate();
    res.status(201).json(savedBlog.toJSON());
  } catch (e) {
    next(e);
  }
});

blogsRouter.delete("/:id", async (req, res, next) => {
  const { token } = req;

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    if (!token || !decodedToken.id) {
      throw new ErrorHelper(401, "Authentication Error", [
        "Invalid or missing authentication token",
      ]);
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).end();

    const belongsToUser = blog.user.toString() === decodedToken.id;
    if (belongsToUser) {
      await blog.remove();
      return res.status(204).end();
    }
    throw new ErrorHelper(403, "Forbidden", [
      "User is not permitted to modify this resource",
    ]);
  } catch (e) {
    return next(e);
  }
});

blogsRouter.put("/:id", async (req, res, next) => {
  const { body, token } = req;

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    if (!token || !decodedToken.id) {
      throw new ErrorHelper(401, "Authentication Error", [
        "Invalid or missing authentication token",
      ]);
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).end();

    blog.author = body.author;
    blog.title = body.title;
    blog.url = body.url;
    blog.likes = body.likes;
    blog.user = body.user;

    const updatedBlog = await blog.save();
    await updatedBlog
      .populate({ path: "user", select: ["name", "username"] })
      .execPopulate();

    return res
      .json(updatedBlog.toJSON())
      .status(200)
      .end();
  } catch (e) {
    return next(e);
  }
});

module.exports = blogsRouter;
