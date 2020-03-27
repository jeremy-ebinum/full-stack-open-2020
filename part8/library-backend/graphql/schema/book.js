const {
  gql,
  UserInputError,
  AuthenticationError,
  PubSub,
} = require("apollo-server");

const {
  getModelValidationErrors,
  useFallbackErrorHandler,
} = require("../../helpers/errorHelper");

const Author = require("../../models/Author");
const Book = require("../../models/Book");

const pubsub = new PubSub();

const typeDef = gql`
  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String!]!
    id: ID!
  }

  extend type Query {
    bookCount: Int!
    allBooks(author: String, genre: String): [Book!]!
  }

  extend type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
  }

  extend type Subscription {
    bookAdded: Book!
  }
`;

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) return Book.find({}).populate("author");

      let author;

      if (args.author && !args.genre) {
        author = await Author.findOne({ name: args.author });
        return Book.find()
          .where({ author: author ? author._id : null })
          .populate("author");
      }

      if (!args.author && args.genre) {
        return Book.find()
          .where({ genres: { $in: [args.genre] } })
          .populate("author");
      }

      author = await Author.findOne({ name: args.author });
      return Book.find()
        .where({
          author: author ? author._id : null,
          genres: { $in: [args.genre] },
        })
        .populate("author");
    },
  },

  Mutation: {
    addBook: async (root, args, { authUser }) => {
      if (!authUser) {
        throw new AuthenticationError("You need to be logged in to add a book");
      }

      let author = await Author.findOne({ name: args.author });

      if (!author) {
        author = new Author({ name: args.author });
        try {
          await author.save();
        } catch (e) {
          if (e.name === "ValidationError") {
            const validationErrors = getModelValidationErrors(e, "Author");

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
      } catch (e) {
        if (e.name === "ValidationError") {
          const validationErrors = getModelValidationErrors(e, "Book");

          throw new UserInputError("Couldn't create new book", {
            invalidArgs: args,
            errorMessages: validationErrors,
          });
        }

        useFallbackErrorHandler(e);
      }

      const savedBook = await book.populate("author").execPopulate();
      pubsub.publish("BOOK_ADDED", { bookAdded: savedBook });
      return savedBook;
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(["BOOK_ADDED"]),
    },
  },
};

module.exports = { typeDef, resolvers };
