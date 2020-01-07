const { gql } = require("apollo-server-lambda");

module.exports = gql`
  type Category {
    id: ID!
    name: String
  }

  extend type Query {
    allCategories: [Category!]
  }
`;
