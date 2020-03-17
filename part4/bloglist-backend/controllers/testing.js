const router = require("express").Router();
const mockDb = require("../tests/mockDb_helper");
const testHelper = require("../tests/test_helper");

router.post("/reset", async (request, response) => {
  mockDb.clearDatabase();
  response.status(204).end();
});

router.get("/blogs", async (req, res) => {
  const blogsInDb = await testHelper.getBlogsInDb();

  res.status(200).json(blogsInDb);
});

router.get("/users", async (req, res) => {
  const usersInDb = await testHelper.getUsersInDb();

  res.status(200).json(usersInDb);
});

module.exports = router;
