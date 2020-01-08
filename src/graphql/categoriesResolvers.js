import gql from "graphql-tag";

export const ALL_CATEGORIES = gql`
  query allCategories {
    allCategories {
      id
      name
    }
  }
`;
