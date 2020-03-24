const {
  ApolloServer,
  gql,
  UserInputError,
  ApolloError,
} = require("apollo-server");
const mongoose = require("mongoose");

const config = require("./utils/config");
const logger = require("./utils/logger");
const {
  getAuthorValidationErrors,
  getBookValidationErrors,
  useFallbackErrorHandler,
} = require("./helpers/errorHelper");
const Book = require("./models/Book");
const Author = require("./models/Author");

const uri = config.MONGODB_URI;

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

console.log("connecting to", uri);

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

const typeDefs = gql`
  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }

  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String!]!
    id: ID!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`;

const resolvers = {
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({});
      return books.reduce((count, book) => {
        return book.author.toString() === root.id ? count + 1 : count;
      }, 0);
    },
  },

  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) return Book.find({}).populate("author");

      let author;

      if (args.author && !args.genre) {
        author = await Author.findOne({ name: args.author });
        return Book.find()
          .where({ author: author ? author._id : null })
          .populate("author");
      } else if (!args.author && args.genre) {
        return Book.find()
          .where({ genres: { $in: [args.genre] } })
          .populate("author");
      } else {
        author = await Author.findOne({ name: args.author });
        return Book.find()
          .where({
            author: author ? author._id : null,
            genres: { $in: [args.genre] },
          })
          .populate("author");
      }
    },
    allAuthors: () => Author.find({}),
  },

  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author });

      if (!author) {
        author = new Author({ name: args.author });
        try {
          await author.save();
        } catch (e) {
          if (e.name === "ValidationError") {
            const validationErrors = getAuthorValidationErrors(e);

            throw new UserInputError("Couldn't create new author", {
              invalidArgs: { author: args.author },
              errorMessages: validationErrors,
            });
          }

          useFallbackErrorHandler(e);
        }
      }

      const book = new Book({
        title: args.title,
        published: args.published,
        author: author._id,
        genres: args.genres,
      });

      try {
        await book.save();
        return book.populate("author").execPopulate();
      } catch (e) {
        if (e.name === "ValidationError") {
          const validationErrors = getBookValidationErrors(e);

          throw new UserInputError("Couldn't create new book", {
            invalidArgs: args,
            errorMessages: validationErrors,
          });
        }

        useFallbackErrorHandler(e);
      }
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name });

      if (!author) {
        throw new ApolloError("The author does not exist", "NOT_FOUND");
      }

      author.born = args.setBornTo;

      try {
        await author.save();
        return author;
      } catch (e) {
        if (e.name === "ValidationError") {
          const validationErrors = getAuthorValidationErrors(e);

          throw new UserInputError("Couldn't update author", {
            invalidArgs: args,
            errorMessages: validationErrors,
          });
        }

        useFallbackErrorHandler(e);
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
