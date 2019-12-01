const { ApolloServer, gql } = require("apollo-server-lambda");
const faunadb = require("faunadb");
const { createPost, allPosts, updatePost, deletePost } = require("./resolvers");

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
});

const typeDefs = gql`
  type Query {
    hello: String
    allPosts: [Post!]
  }
  type Post {
    id: ID!
    uuid: String!
    title: String!
    description: String!
  }

  type Mutation {
    createPost(title: String!, description: String!): Boolean!
    updatePost(id: String!, title: String!, description: String!): Boolean!
    deletePost(id: String!): Boolean!
  }
`;

const resolvers = {
  Query: {
    hello: (root, args, context) => {
      return "Hello, world!";
    },
    allPosts: (root, args, context) => allPosts(root, args, { context, client })
  },
  Mutation: {
    createPost: async (root, args, context) =>
      createPost(root, args, { ...context, client }),
    updatePost: async (root, args, context) =>
      updatePost(root, args, { ...context, client }),
    deletePost: async (root, args, context) =>
      deletePost(root, args, { ...context, client })
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

exports.handler = server.createHandler();
