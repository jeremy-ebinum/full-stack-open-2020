const { gql } = require("apollo-server");

const typeDef = gql`
  type Query {
    _root: String
  }

  type Mutation {
    _root: String
  }

  type Subscription {
    _root: String
  }
`;

module.exports = { typeDef };
