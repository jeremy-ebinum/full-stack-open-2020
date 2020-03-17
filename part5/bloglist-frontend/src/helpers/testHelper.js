/* istanbul ignore file */
export const getTestIDs = () => {
  const isTestEnv = process.env.NODE_ENV === "test";
  const isE2E = process.env.REACT_APP_E2E;

  if (!isTestEnv && !isE2E) return {};

  let ids = new Map();
  let proxy = new Proxy(
    {},
    {
      get: function(obj, prop) {
        if (!ids.has(prop)) {
          ids.set(prop, prop);
        }
        return ids.get(prop);
      },
    }
  );
  return proxy;
};

const host = "http://localhost";
const blogsPath = "/api/blogs";
const loginPath = "/api/login";

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

const validLoggedInUser = {
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXJuYW1lIiwiaWQiOiI1ZTQ3ZTViZGRkMWRmOTEyNjA0MjBkYzMiLCJpYXQiOjE1ODIzOTcwNzZ9.r81M5sJz6xjW3GpTOjfysJDvFelra_oFdDuqKrZ4zxw",
  username: "username",
  name: "Uchiha Madara",
};

const validLoggedInUserId = "5e47e5bddd1df91260420dc3";

const validNewBlog = {
  title: "The Necrohol of Nabudis",
  author: "Final Fantasy Fandom Wiki",
  url: "https://finalfantasy.fandom.com/wiki/Necrohol_of_Nabudis",
};

export default {
  host,
  blogsPath,
  loginPath,
  blogs,
  validLoggedInUser,
  validLoggedInUserId,
  validNewBlog,
};
