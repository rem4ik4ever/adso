const { gql } = require("apollo-server-lambda");

const typeDefs = gql`
  type User {
    uuid: String!
    firstName: String!
    lastName: String!
    email: String!
  }

  type Query {
    me: User!
  }

  type AuthResponse {
    accessToken: String!
    refreshToken: String!
  }

  input RegisterInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Mutation {
    register(data: RegisterInput!): Boolean
    login(data: LoginInput!): AuthResponse
    confirmUser(token: String!): Boolean
  }
`;

module.exports = typeDefs;
