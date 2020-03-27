const {
  gql,
  UserInputError,
  AuthenticationError,
  ApolloError,
} = require("apollo-server");

const {
  getModelValidationErrors,
  useFallbackErrorHandler,
} = require("../../helpers/errorHelper");

const Author = require("../../models/Author");

const typeDef = gql`
  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }

  extend type Query {
    authorCount: Int!
    allAuthors: [Author!]!
  }

  extend type Mutation {
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`;

const resolvers = {
  Author: {
    bookCount: ({ id }, args, { bookCountLoader }) => {
      return bookCountLoader.load(id.toString());
    },
  },

  Query: {
    authorCount: () => Author.collection.countDocuments(),
    allAuthors: () => {
      return Author.find({});
    },
  },

  Mutation: {
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

      return author;
    },
  },
};

module.exports = { typeDef, resolvers };
