const { gql, UserInputError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const config = require("../../utils/config");

const {
  getModelValidationErrors,
  useFallbackErrorHandler,
} = require("../../helpers/errorHelper");

const User = require("../../models/User");

const typeDef = gql`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  extend type Query {
    allUsers: [User!]!
    me: User
  }

  extend type Mutation {
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }
`;

const resolvers = {
  Query: {
    allUsers: () => User.find({}),
    me: (root, args, { authUser }) => {
      return authUser;
    },
  },

  Mutation: {
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      try {
        await user.save();
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

      return user;
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
};

module.exports = { typeDef, resolvers };
