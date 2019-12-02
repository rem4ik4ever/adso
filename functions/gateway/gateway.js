/**
 * This code assumes you have other graphql Netlify functions
 * and shows you how to stitch them together in a "gateway".
 *
 * Of course, feel free to modify this gateway to suit your needs.
 */

const {
  introspectSchema,
  makeRemoteExecutableSchema,
  mergeSchemas
} = require("graphql-tools");
const { createHttpLink } = require("apollo-link-http");
const fetch = require("node-fetch");
const { ApolloServer } = require("apollo-server-lambda");

exports.handler = async function(event, context) {
  const schema1 = await getSchema("fauna"); // other Netlify functions which are graphql lambdas
  const schema2 = await getSchema("authentication"); // other Netlify functions which are graphql lambdas
  const schemas = [schema1, schema2];

  // more docs https://www.apollographql.com/docs/graphql-tools/schema-stitching#api
  const schema = mergeSchemas({
    schemas
  });
  const server = new ApolloServer({
    schema,
    formatError: err => {
      console.log(err);
      return err;
    }
  });
  return new Promise((yay, nay) => {
    const cb = (err, args) => (err ? nay(err) : yay(args));
    server.createHandler()(event, context, cb);
  });
};

async function getSchema(endpoint) {
  // you can't use relative URLs within Netlify Functions so need a base URL
  // process.env.URL is one of many build env variables:
  // https://www.netlify.com/docs/continuous-deployment/#build-environment-variables
  // Netlify Dev only supports URL and DEPLOY URL for now
  const uri = process.env.URL + "/.netlify/functions/" + endpoint;
  const link = createHttpLink({ uri, fetch });
  const schema = await introspectSchema(link);
  const executableSchema = makeRemoteExecutableSchema({ schema, link });
  return executableSchema;
}
