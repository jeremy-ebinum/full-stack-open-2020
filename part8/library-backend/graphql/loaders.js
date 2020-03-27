const DataLoader = require("dataloader");
const _countBy = require("lodash.countby");
const Book = require("../models/Book");

const createBookCountLoader = () => {
  return new DataLoader(async (authorIds) => {
    const books = await Book.find({});
    const booksByAuthorId = books.map((b) => b.author);
    const authorIdCounts = _countBy(booksByAuthorId, (id) => id);

    return authorIds.map((id) => authorIdCounts[id] || 0);
  });
};

module.exports = { createBookCountLoader };
