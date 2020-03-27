const { typeDef: base } = require("./schema/root");
const { typeDef: Author } = require("./schema/author");
const { typeDef: Book } = require("./schema/book");
const { typeDef: User } = require("./schema/user");

const typeDefs = [base, Author, Book, User];

module.exports = typeDefs;
