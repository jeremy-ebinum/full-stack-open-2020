require("dotenv").config();

const { MONGODB_URI } = process.env;

module.exports = { MONGODB_URI };
