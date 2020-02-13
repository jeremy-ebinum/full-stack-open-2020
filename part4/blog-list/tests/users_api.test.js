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
  test("fails with statuscode 400 if the user is invalid", async () => {
    await api
      .post("/api/users")
      .send({ name: "name", password: "password" })
      .set("Content-Type", "application/json")
      .expect(400);

    await api
      .post("/api/users")
      .send({ name: "name", username: "username" })
      .set("Content-Type", "application/json")
      .expect(400);
  });

  describe("fails with statuscode 422 and error hints if...", () => {
    test("username is not unique", async () => {
      const existingUsername = helper.initialUsers[0].username;

      const response = await api
        .post("/api/users")
        .set("Content-Type", "application/json")
        .send({ username: existingUsername, name: "Name", password: "passw" })
        .expect(422);

      const isUniqueError = /unique/.test(response.body.error.message);
      expect(isUniqueError).toBe(true);
      expect(response.body.error.message.toLowerCase()).toContain("username");

      const usersAtEnd = await helper.getUsersInDb();
      expect(usersAtEnd.length).toBe(helper.initialUsers.length);
    });

    test("username is less than 3 chars", async () => {
      const response = await api
        .post("/api/users")
        .set("Content-Type", "application/json")
        .send({ username: "UM", name: "Uchiha", password: "password" })
        .expect(422);

      const minLengthRegex = /at least \(\d+\)/;
      const isMinLengthError = minLengthRegex.test(response.body.error.message);
      expect(isMinLengthError).toBe(true);
      expect(response.body.error.message.toLowerCase()).toContain("username");

      const usersAtEnd = await helper.getUsersInDb();
      expect(usersAtEnd.length).toBe(helper.initialUsers.length);
    });

    test("password is less than 3 chars", async () => {
      const response = await api
        .post("/api/users")
        .set("Content-Type", "application/json")
        .send({ username: "madara", name: "Madara", password: "pw" })
        .expect(422);

      const minLengthRegex = /at least \(\d+\)/;
      const isMinLengthError = minLengthRegex.test(response.body.error.message);
      expect(isMinLengthError).toBe(true);
      expect(response.body.error.message.toLowerCase()).toContain("password");

      const usersAtEnd = await helper.getUsersInDb();
      expect(usersAtEnd.length).toBe(helper.initialUsers.length);
    });
  });

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
