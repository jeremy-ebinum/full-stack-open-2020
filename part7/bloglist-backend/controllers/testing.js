const router = require("express").Router();
const mockDb = require("../tests/mockDb_helper");

router.post("/reset", async (request, response) => {
  mockDb.clearDatabase();
  response.status(204).end();
});

module.exports = router;
