const { gql } = require("apollo-server-lambda");

module.exports = gql`
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
    # createConversation(postId: String!): Conversation
    getConversation(id: String!): Conversation
  }

  extend type Mutation {
    createConversation(postId: String!): Conversation
  }
`;
