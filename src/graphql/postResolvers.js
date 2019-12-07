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
  mutation CreatePost($title: String!, $description: String!) {
    createPost(title: $title, description: $description)
  }
`;
