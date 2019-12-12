const { gql } = require("apollo-server-lambda");

module.exports = gql`
  scalar Date

  extend type Query {
    allPosts: [Post!]
  }

  type PostLocation {
    postId: String!
    country: String!
    province: String!
    city: String!
    postalCode: String!
    lon: Float!
    lat: Float!
  }

  type Post {
    id: ID!
    uuid: String!
    title: String!
    description: String!
    authorId: String!
    tags: [String!]
    images: [String!]
    active: Boolean!
    priceInfo: String!
    price: Float
    address: String
    latitude: Float!
    longitude: Float!
    createdAt: String!
    updatedAt: String!
  }

  type S3Payload {
    url: String!
    signedRequest: String!
  }

  extend type Mutation {
    createPost(
      title: String!
      description: String!
      images: [String!]
      tags: [String!]
      priceInfo: String!
      price: Float
      address: String!
      latitude: Float!
      longitude: Float!
    ): Boolean!
    updatePost(id: String!, title: String!, description: String!): Boolean!
    deletePost(id: String!): Boolean!
    signS3(filename: String!, filetype: String!): S3Payload!
  }
`;
