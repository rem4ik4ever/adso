const { ApolloServer, gql } = require("apollo-server-lambda");
const faunadb = require("faunadb");
const authTypeDefs = require("./modules/authentication/typeDefs");
const authResolvers = require("./modules/authentication/resolvers");
const postResolvers = require("./modules/posts/resolvers");
const postTypeDefs = require("./modules/posts/typeDefs");
const { rootTypes, rootResolvers } = require("./modules/rootTypes.js");
const { merge } = require("lodash");

const server = new ApolloServer({
  typeDefs: [rootTypes, authTypeDefs, postTypeDefs],
  resolvers: merge(rootResolvers, authResolvers, postResolvers),
  context: ({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context
  })
});

exports.handler = server.createHandler();
