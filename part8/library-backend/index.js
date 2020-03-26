const {
  ApolloServer,
  gql,
  PubSub,
  UserInputError,
  AuthenticationError,
  ApolloError,
} = require("apollo-server");
const pubsub = new PubSub();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const config = require("./utils/config");
const logger = require("./utils/logger");
const {
  getModelValidationErrors,
  useFallbackErrorHandler,
} = require("./helpers/errorHelper");
const Book = require("./models/Book");
const Author = require("./models/Author");
const User = require("./models/User");

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

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    allUsers: [User!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }

  type Subscription {
    bookAdded: Book!
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
    allUsers: () => User.find({}),
    me: (root, args, { authUser }) => {
      return authUser;
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
        const savedBook = await book.populate("author").execPopulate();
        pubsub.publish("BOOK_ADDED", { bookAdded: savedBook });
        return savedBook;
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
    },
    editAuthor: async (root, args, { authUser }) => {
      if (!authUser) {
        throw new AuthenticationError(
          "You need to be logged in to update an author"
        );
      }
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
          const validationErrors = getModelValidationErrors(e, "Author");

          throw new UserInputError("Couldn't update author", {
            invalidArgs: args,
            errorMessages: validationErrors,
          });
        }

        useFallbackErrorHandler(e);
      }
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      try {
        await user.save();
        return user;
      } catch (e) {
        if (e.name === "ValidationError") {
          const validationErrors = getModelValidationErrors(e, "User");

          throw new UserInputError("Couldn't create user", {
            invalidArgs: args,
            errorMessages: validationErrors,
          });
        }

        useFallbackErrorHandler(e);
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "password") {
        throw new UserInputError("Couldn't login user", {
          invalidArgs: args,
          errorMessages: ["Invalid username or password"],
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, config.JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(["BOOK_ADDED"]),
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const decodedToken = jwt.verify(auth.substring(7), config.JWT_SECRET);
      const authUser = await User.findById(decodedToken.id);
      return { authUser };
    }
  },
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`);
  console.log(`Subscriptions ready at ${subscriptionsUrl}`);
});
