const blogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 13,
    user: {
      username: "username",
      name: "Uchiha Madara",
      id: "5e47e5bddd1df91260420dc3",
    },
    id: "5e47e615dd1df91260420dc6",
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url:
      "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 12,
    user: {
      username: "username",
      name: "Uchiha Madara",
      id: "5e47e5bddd1df91260420dc3",
    },
    id: "5e47e65fdd1df91260420dc7",
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 25,
    user: {
      username: "username",
      name: "Uchiha Madara",
      id: "5e47e5bddd1df91260420dc3",
    },
    id: "5e47e681dd1df91260420dc8",
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url:
      "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 11,
    user: {
      username: "username2",
      name: "Uchiha Itachi",
      id: "5e47e5d1dd1df91260420dc4",
    },
    id: "5e47e6a8dd1df91260420dc9",
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url:
      "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    user: {
      username: "username2",
      name: "Uchiha Itachi",
      id: "5e47e5d1dd1df91260420dc4",
    },
    id: "5e47e6badd1df91260420dca",
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    user: {
      username: "username3",
      name: "Uchiha Obito",
      id: "5e47e5dedd1df91260420dc5",
    },
    id: "5e47e6dbdd1df91260420dcb",
  },
];

// eslint-disable-next-line no-unused-vars
let token = null;

const setToken = (newToken) => {
  if (newToken) {
    token = `Bearer ${newToken}`;
  } else {
    token = null;
  }
};

const getAll = () => {
  return Promise.resolve(blogs);
};

export default { setToken, getAll };
