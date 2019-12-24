import gql from "graphql-tag";

export const SIGN_S3 = gql`
  mutation signS3($filename: String!, $filetype: String!) {
    signS3(filename: $filename, filetype: $filetype) {
      url
      signedRequest
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost(
    $title: String!
    $description: String!
    $images: [String!]
    $tags: [String!]
    $priceInfo: String!
    $price: Float
    $address: String!
    $latitude: Float!
    $longitude: Float!
  ) {
    createPost(
      title: $title
      description: $description
      images: $images
      tags: $tags
      priceInfo: $priceInfo
      price: $price
      address: $address
      latitude: $latitude
      longitude: $longitude
    ) {
      uuid
    }
  }
`;

export const ALL_POSTS = gql`
  query allPosts($after: String, $perPage: Int!) {
    allPosts(perPage: $perPage, after: $after) {
      data {
        uuid
        title
        price
        priceInfo
        images
        tags
        createdAt
      }
      perPage
      after
    }
  }
`;

export const GET_POST = gql`
  query getPost($id: String!) {
    getPost(id: $id) {
      uuid
      title
      description
      priceInfo
      price
      images
      tags
      address
      latitude
      longitude
      createdAt
      author {
        firstName
        lastName
        name
      }
    }
  }
`;
