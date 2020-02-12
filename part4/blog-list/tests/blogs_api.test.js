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

describe("On GET /api/blogs", () => {
  test("response content-type is application/json", async () => {
    await api.get("/api/blogs").expect("Content-Type", /application\/json/);
  });

  test("response has the correct amount of blogs", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body.length).toBe(helper.initialBlogs.length);
  });

  test("the returned blogs have id property", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body[0].id).toBeDefined();
  });
});

afterAll(async () => {
  await mockDb.closeDatabase();
  await new Promise(resolve => setTimeout(() => resolve(), 0)); // avoid jest open handle error
});
