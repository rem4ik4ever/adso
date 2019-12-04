const { gql } = require("apollo-server-lambda");

const rootTypes = gql`
  type Query {
    hello: String
  }

  type Mutation {
    hello: String
  }
`;

const rootResolver = {
  Query: {
    hello: () => "Hello World"
  },
  Mutation: {
    hello: () => "Hello World"
  }
};

module.exports = {
  rootTypes,
  rootResolver
};
