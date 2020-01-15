const { gql } = require("apollo-server-lambda");

module.exports = gql`
  scalar Date

  type Conversation {
    id: ID!
    postId: String
    post: Post
    active: Boolean!
    participants: [User!]
    createdAt: Date!
  }

  type ConversationPaginateResponse {
    data: [Conversation!]
    after: String
    before: String
    perPage: Int!
  }
  extend type Query {
    myConversations(after: String, perPage: Int): ConversationPaginateResponse!

    getConversation(id: String!)
  }

  extend type Mutation {
    createConversation(postId: String!): Conversation
  }
`;
