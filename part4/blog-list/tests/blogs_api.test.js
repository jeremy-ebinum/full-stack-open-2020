const supertest = require("supertest");
const mockDb = require("./mockDb_helper");
const helper = require("./test_helper");
const Blog = require("../models/blog");
const app = require("../app");

const api = supertest(app);

jest.setTimeout(60000);

beforeAll(async () => mockDb.connect());

beforeEach(async () => {
  await mockDb.clearDatabase();

  const newBlogs = helper.initialBlogs.map(blog => new Blog(blog));
  const promiseArray = newBlogs.map(blog => blog.save());

  await Promise.all(promiseArray);
});

describe("Fetching existing blogs collection: GET /api/blogs", () => {
  test("returns blogs as json", async () => {
    await api.get("/api/blogs").expect("Content-Type", /application\/json/);
  });

  test("returns all blogs on server", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body.length).toBe(helper.initialBlogs.length);
  });

  test("returns blogs that each have an 'id' prop", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body[0].id).toBeDefined();
  });
});

describe("Sending a blog: POST /api/blogs", () => {
  test("fails with statuscode 400 if the blog is invalid", async () => {
    let newBlog = new Blog(helper.blogWithMissingTitle);

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Content-Type", "application/json")
      .then(res => {
        expect(res.status).toBe(400);
      });

    newBlog = new Blog(helper.blogWithMissingUrl);

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Content-Type", "application/json")
      .then(res => {
        expect(res.status).toBe(400);
      });
  });

  test("saves the blog to db if valid", async () => {
    const newBlog = new Blog(helper.validBlog);

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.getBlogsInDb();
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map(blog => blog.title);
    expect(titles).toContain(helper.validBlog.title);
  });

  test("sets the blog's 'likes' to 0 if missing", async () => {
    const newBlog = new Blog(helper.blogWithMissingLikes);

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Content-Type", "application/json")
      .then(res => {
        expect(res.body.likes).toBe(0);
      });
  });
});

afterAll(async () => {
  await mockDb.closeDatabase();
  await new Promise(resolve => setTimeout(() => resolve(), 0)); // avoid jest open handle error
});
