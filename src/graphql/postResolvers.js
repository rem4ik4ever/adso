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
    $images: [String!]!
    $tags: [String!]!
    $priceInfo: String!
    $price: Float
    $address: String!
    $latitude: Float!
    $longitude: Float!
    $categoryId: Int!
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
      categoryId: $categoryId
    ) {
      id
      uuid
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost(
    $id: String!
    $title: String
    $description: String
    $images: [String!]
    $tags: [String!]
    $priceInfo: String
    $price: Float
    $address: String
    $latitude: Float
    $longitude: Float
  ) {
    updatePost(
      id: $id
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
      id
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
      authorId
    }
  }
`;

export const ALL_POSTS = gql`
  query allPosts($after: String, $perPage: Int!) {
    allPosts(perPage: $perPage, after: $after) {
      data {
        id
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
      id
      title
      description
      priceInfo
      price
      images
      tags
      address
      latitude
      longitude
      createdDate
      author {
        name
        firstName
        lastName
      }
    }
  }
`;

export const GET_EDIT_POST = gql`
  query getEditPost($id: String!) {
    getEditPost(id: $id) {
      id
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
    }
  }
`;

export const FLEX_SEARCH_POSTS = gql`
  query postsByFlexSearch(
    $searchTerm: String!
    $location: LocationSearchInput
    $priceRange: PriceSearchInput
    $categoryId: String
    $perPage: Int!
    $after: String
  ) {
    postsByFlexSearch(
      searchTerm: $searchTerm
      location: $location
      priceRange: $priceRange
      perPage: $perPage
      after: $after
      categoryId: $categoryId
    ) {
      data {
        id
        title
        description
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

export const MY_ADS = gql`
  query myAds($searchTerm: String, $perPage: Int!, $after: String) {
    myAds(searchTerm: $searchTerm, perPage: $perPage, after: $after) {
      data {
        id
        title
        description
        price
        priceInfo
        authorId
        images
        tags
        createdAt
        updatedAt
      }
      perPage
      after
    }
  }
`;
