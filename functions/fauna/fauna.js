const { ApolloServer } = require("apollo-server-lambda");
const authTypeDefs = require("./modules/authentication/typeDefs");
const authResolvers = require("./modules/authentication/resolvers");
const postResolvers = require("./modules/posts/resolvers");
const postTypeDefs = require("./modules/posts/typeDefs");
const categoryTypeDefs = require("./modules/categories/typeDefs");
const categoryResolvers = require("./modules/categories/resolvers");
const conversationTypeDefs = require("./modules/conversations/typeDefs");
const conversationResolvers = require("./modules/conversations/resolvers");
const { rootTypes, rootResolver } = require("./modules/rootTypes.js");
const { merge } = require("lodash");

const server = new ApolloServer({
  typeDefs: [
    rootTypes,
    authTypeDefs,
    postTypeDefs,
    categoryTypeDefs,
    conversationTypeDefs
  ],
  resolvers: merge(
    rootResolver,
    authResolvers,
    postResolvers,
    categoryResolvers,
    conversationResolvers
  ),
  context: ctx => {
    const { event, context } = ctx;
    return {
      headers: event.headers,
      functionName: context.functionName,
      event,
      context
    };
  },
  playground: process.env.NETLIFY_DEV
});

exports.handler = server.createHandler();
