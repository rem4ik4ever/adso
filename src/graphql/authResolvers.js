import gql from "graphql-tag";

export const REGISTER_USER = gql`
  mutation register($data: RegisterInput!) {
    register(data: $data)
  }
`;

export const CONFIRM_USER = gql`
  mutation confirmUser($token: String!) {
    confirmUser(token: $token)
  }
`;
