const { gql } = require("apollo-server-lambda");

module.exports = gql`
  scalar Date

  type PaginateResponse {
    data: [Post!]
    after: String
    before: String
    perPage: Int!
  }

  input LocationSearchInput {
    distance: Int!
    latitude: Float!
    longitude: Float!
  }

  input PriceSearchInput {
    from: Int!
    to: Int
  }

  extend type Query {
    allPosts(after: String, perPage: Int!): PaginateResponse!
    postsBySearchTerm(
      after: String
      perPage: Int!
      searchTerm: String!
    ): PaginateResponse!

    postsByPriceRange(
      after: String
      perPage: Int!
      fromPrice: Int!
      toPrice: Int!
    ): PaginateResponse!

    postsByLocation(
      longitude: Float!
      latitude: Float!
      distance: Int!
      after: String
      perPage: Int!
    ): PaginateResponse!

    postsByFlexSearch(
      location: LocationSearchInput
      priceRange: PriceSearchInput
      searchTerm: String!
      perPage: Int!
      after: String
    ): PaginateResponse!

    getPost(id: String!): Post

    myAds(searchTerm: String, perPage: Int!, after: String): PaginateResponse!
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
    author: User!
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
    ): Post
    updatePost(id: String!, title: String!, description: String!): Boolean!
    deletePost(id: String!): Boolean!
    signS3(filename: String!, filetype: String!): S3Payload!
  }
`;
