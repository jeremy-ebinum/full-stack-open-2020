const supertest = require("supertest");
const mongoose = require("mongoose");
const mockDb = require("./mockDb_helper");
const helper = require("./test_helper");
const User = require("../models/user");
const Blog = require("../models/blog");
const app = require("../app");

const api = supertest(app);

jest.setTimeout(60000);

beforeAll(async () => mockDb.connect());

beforeEach(async () => {
  await mockDb.clearDatabase();

  const newUsers = helper.initialUsers.map(user => new User(user));
  const userPromises = newUsers.map(user => user.save());

  const validUserId = await helper.getValidUserId();

  const newBlogs = helper.initialBlogs.map(
    blog => new Blog({ ...blog, user: validUserId })
  );
  const blogsPromises = newBlogs.map(blog => blog.save());

  const promiseArray = userPromises.concat(blogsPromises);

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

  test("returns blogs w/ a ref id to the creator User", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body[0].user).toBeDefined();
    let isValidId;
    if (typeof response.body[0].user === "object") {
      isValidId = mongoose.Types.ObjectId.isValid(response.body[0].user.id);
    } else {
      isValidId = mongoose.Types.ObjectId.isValid(response.body[0].user);
    }
    expect(isValidId).toBe(true);
  });
});

describe("Fetching specific blog member: GET /api/blogs/id", () => {
  test("fails with statuscode 400 if the id is invalid", async () => {
    const invalidId = "spamandeggsandspam";
    await api.get(`/api/blogs/${invalidId}`).expect(400);
  });

  test("fails with statuscode 404 if the blog doesn't exist", async () => {
    const deletedValidId = await helper.getDeletedValidId();
    await api.get(`/api/blogs/${deletedValidId}`).expect(404);
  });

  test("succeeds if the member with that id exists", async () => {
    const blogsInDb = await helper.getBlogsInDb();
    const blogToView = blogsInDb[0];

    const response = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toEqual(
      expect.objectContaining({
        title: blogToView.title,
        author: blogToView.author,
        url: blogToView.url,
        likes: blogToView.likes,
        id: blogToView.id,
        user: blogToView.user.toString()
      })
    );
  });
});

describe("Sending a blog: POST /api/blogs", () => {
  test("fails with statuscode 400 if the blog is invalid", async () => {
    let newBlog = new Blog(helper.blogWithMissingTitle);

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Content-Type", "application/json")
      .expect(400);

    newBlog = new Blog(helper.blogWithMissingUrl);

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Content-Type", "application/json")
      .expect(400);
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

describe("Deleting specific blog member: DELETE /api/blogs/id", () => {
  test("fails with statuscode 400 if the id is invalid", async () => {
    const invalidId = "spamandeggsandspam";
    await api.delete(`/api/blogs/${invalidId}`).expect(400);
  });

  test("receives statuscode 404 if the blog doesn't exist", async () => {
    const deletedValidId = await helper.getDeletedValidId();
    await api.delete(`/api/blogs/${deletedValidId}`).expect(404);
  });

  test("deletes the blog member with that id if valid", async () => {
    const blogsatStart = await helper.getBlogsInDb();
    const blogToDelete = blogsatStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.getBlogsInDb();
    const titles = blogsAtEnd.map(blog => blog.title);
    expect(titles).not.toContain(blogToDelete.title);
  });
});

describe("Replacing specific blog member: PUT /api/blogs/id", () => {
  test("fails with statuscode 400 if the id is invalid", async () => {
    const invalidId = "spamandeggsandspam";
    await api.put(`/api/blogs/${invalidId}`).expect(400);
  });

  test("fails with statuscode 400 if the replacement is invalid", async () => {
    const blogsatStart = await helper.getBlogsInDb();
    const blogToReplace = blogsatStart[0];
    const replacementWithNoTitle = { ...blogToReplace, title: null };
    const replacementWithNoUrl = { ...blogToReplace, url: null };

    await api
      .put(`/api/blogs/${blogToReplace.id}`)
      .set("Content-Type", "application/json")
      .send(replacementWithNoTitle)
      .expect(400);

    await api
      .put(`/api/blogs/${blogToReplace.id}`)
      .set("Content-Type", "application/json")
      .send(replacementWithNoUrl)
      .expect(400);
  });

  test("receives statuscode 404 if the blog doesn't exist", async () => {
    const deletedValidId = await helper.getDeletedValidId();
    await api.put(`/api/blogs/${deletedValidId}`).expect(404);
  });

  test("replaces the blog member bearing that id if valid", async () => {
    const blogsatStart = await helper.getBlogsInDb();
    const blogToReplace = blogsatStart[0];
    const replacement = { ...blogToReplace, likes: 9999 };

    await api
      .put(`/api/blogs/${blogToReplace.id}`)
      .set("Content-Type", "application/json")
      .send(replacement)
      .expect(200);

    const blogsAtEnd = await helper.getBlogsInDb();
    const replacedBlog = blogsAtEnd.filter(b => b.id === replacement.id)[0];
    expect(replacedBlog.likes).toBe(replacement.likes);
  });
});

afterAll(async () => {
  await mockDb.closeDatabase();
  await new Promise(resolve => setTimeout(() => resolve(), 0)); // avoid jest open handle error
});
