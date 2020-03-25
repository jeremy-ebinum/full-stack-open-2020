require("dotenv").config();

const { MONGODB_URI, JWT_SECRET } = process.env;

module.exports = { MONGODB_URI, JWT_SECRET };
