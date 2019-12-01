const { ApolloServer, gql } = require("apollo-server-lambda");
const admin = require("firebase-admin");
const credentials = require("./adso-app-firebase-adminsdk-p6plk-bd984f0232.json");
const { createPost, allPosts } = require("./resolvers");

const typeDefs = gql`
  type Query {
    hello: String
    allPosts: [Post!]
    allAuthors: [Author!]
    author(id: Int!): Author
    authorByName(name: String!): Author
  }
  type Author {
    id: ID!
    name: String!
    married: Boolean!
  }

  type Post {
    id: ID!
    title: String!
    description: String!
  }

  type Mutation {
    createPost(title: String!, description: String!): Boolean!
  }
`;

const authors = [
  { id: 1, name: "Terry Pratchett", married: false },
  { id: 2, name: "Stephen King", married: true },
  { id: 3, name: "JK Rowling", married: false }
];

const resolvers = {
  Query: {
    hello: (root, args, context) => {
      return "Hello, world!";
    },
    allAuthors: (root, args, context) => {
      return authors;
    },
    author: (root, args, context) => {
      return;
    },
    authorByName: (root, args, context) => {
      console.log("hihhihi", args.name);
      return authors.find(x => x.name === args.name) || "NOTFOUND";
    },
    allPosts: (root, args, context) =>
      allPosts(root, args, { ...context, admin })
  },
  Mutation: {
    createPost: async (root, args, context) =>
      createPost(root, args, { ...context, admin })
  }
};

admin.initializeApp({
  credential: admin.credential.cert(credentials)
});

const server = new ApolloServer({
  typeDefs,
  resolvers
});

exports.handler = server.createHandler();
