const { gql } = require("apollo-server-lambda");

module.exports = gql`
  scalar Date

  type Message {
    id: ID!
    text: String!
    conversationId: String
    conversation: Conversation!
    userId: String!
    user: User!
    createdAt: Date!
  }
`;
