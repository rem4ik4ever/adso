const { gql } = require("apollo-server-lambda");

module.exports = gql`
  type User {
    uuid: String!
    firstName: String!
    lastName: String!
    name: String!
    email: String!
  }

  extend type Query {
    me: User
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

  extend type Mutation {
    register(data: RegisterInput!): Boolean
    login(email: String!, password: String!): AuthResponse
    confirmUser(token: String!): Boolean
    refresh: String
    resendConfirmation(token: String!): Boolean
  }
`;
