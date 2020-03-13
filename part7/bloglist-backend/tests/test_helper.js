const bcrypt = require("bcrypt");
const logger = require("../utils/logger");
const User = require("../models/user");
const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url:
      "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url:
      "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url:
      "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  },
];

const validBlog = {
  title: "A Beginner's JavaScript Study Plan",
  author: "Sara Harrison",
  url:
    "https://www.freecodecamp.org/news/a-beginners-javascript-study-plan-27f1d698ea5e/",
  likes: 0,
};

const blogWithMissingLikes = {
  title: "17 Obscure Horror Games We Recommend",
  author: "Ryan Stanford",
  url:
    "https://www.relyonhorror.com/articles/17-obscure-horror-games-we-recommend/",
};

const blogWithMissingTitle = {
  author: "Robert C. Martin",
  url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
  likes: 0,
};

const blogWithMissingUrl = {
  title: "Type wars",
  author: "Robert C. Martin",
  likes: 0,
};

const getUsersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

const getBlogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const getLatestBlogInDb = async () => {
  const blogs = await Blog.find()
    .sort({ _id: -1 })
    .limit(1);

  return blogs.map((blog) => blog.toJSON())[0];
};

const getDeletedValidBlogId = async () => {
  const blog = new Blog({
    title: "None Existence",
    author: "John Doe",
    url: "http://dummyurl.com",
    likes: 0,
  });

  let id;

  try {
    await blog.save();
    await blog.remove();
    id = blog._id.toString();
  } catch (e) {
    logger.error("IN getNoneExistingvalidId:\n", e);
  }

  return id;
};

const plainUsers = [
  {
    username: "username",
    name: "Username",
    password: "password",
  },
  {
    username: "username2",
    name: "Username2",
    password: "password2",
  },
  {
    username: "username3",
    name: "Username3",
    password: "password3",
  },
];

const hashPasswordMixin = (users) => {
  const saltRounds = 1;
  const clonedUsers = JSON.parse(JSON.stringify(users));
  const usersWithHashedPasswords = clonedUsers.map((user) => {
    const passwordHash = bcrypt.hashSync(user.password, saltRounds);
    user.passwordHash = passwordHash;
    delete user.password;

    return user;
  });

  return usersWithHashedPasswords;
};

const initialUsers = hashPasswordMixin(plainUsers);

const validComment = "Nice Blog!";
const invalidComment = { spam: "eggs" };

module.exports = {
  initialBlogs,
  validBlog,
  blogWithMissingTitle,
  blogWithMissingUrl,
  getBlogsInDb,
  getLatestBlogInDb,
  getDeletedValidBlogId,
  blogWithMissingLikes,
  getUsersInDb,
  plainUsers,
  initialUsers,
  validComment,
  invalidComment,
};
