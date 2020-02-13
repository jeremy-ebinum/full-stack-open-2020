const supertest = require("supertest");
const mockDb = require("./mockDb_helper");
const helper = require("./test_helper");
const User = require("../models/user");
const app = require("../app");

const api = supertest(app);

jest.setTimeout(60000);

beforeAll(async () => mockDb.connect());

beforeEach(async () => {
  await mockDb.clearDatabase();

  const newUsers = helper.initialUsers.map(user => new User(user));
  const userPromises = newUsers.map(user => user.save());

  await Promise.all(userPromises);
});

describe("Fetching existing users collection: GET /api/users", () => {
  test("returns all users on server as JSON", async () => {
    const response = await api
      .get("/api/users")
      .expect("Content-Type", /application\/json/);
    expect(response.body.length).toBe(helper.initialUsers.length);
  });

  test("returns users without exposing sensitive data", async () => {
    const response = await api.get("/api/users");
    const userProps = Object.getOwnPropertyNames(response.body[0]);
    expect(userProps).not.toContain("passwordHash");
  });
});

describe("Sending a user: POST /api/users", () => {
  test("saves the user to db if valid", async () => {
    const userToSave = {
      username: "admin",
      name: "Admin",
      password: "admin"
    };

    await api
      .post("/api/users")
      .set("Content-Type", "application/json")
      .send(userToSave)
      .expect(201);

    const usersAtEnd = await helper.getUsersInDb();
    expect(usersAtEnd.length).toBe(helper.initialUsers.length + 1);

    const usernames = usersAtEnd.map(user => user.username);
    expect(usernames).toContain(userToSave.username);
  });
});

afterAll(async () => {
  await mockDb.closeDatabase();
  await new Promise(resolve => setTimeout(() => resolve(), 0)); // avoid jest open handle error
});
