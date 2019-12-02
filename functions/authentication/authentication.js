const { ApolloServer, gql } = require("apollo-server-lambda");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context
  })
});

exports.handler = server.createHandler();
