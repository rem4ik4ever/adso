const { gql } = require("apollo-server-lambda");

module.exports = gql`
  extend type Query {
    allPosts: [Post!]
  }
  type Post {
    id: ID!
    uuid: String!
    title: String!
    description: String!
    author: User!
  }

  extend type Mutation {
    createPost(title: String!, description: String!): Boolean!
    updatePost(id: String!, title: String!, description: String!): Boolean!
    deletePost(id: String!): Boolean!
  }
`;
