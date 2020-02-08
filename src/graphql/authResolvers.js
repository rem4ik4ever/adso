import gql from "graphql-tag";

export const REGISTER_USER = gql`
  mutation register($data: RegisterInput!) {
    register(input: $data) {
      email
      firstName
      lastName
    }
  }
`;

export const CONFIRM_USER = gql`
  mutation confirmUser($token: String!) {
    confirm(token: $token)
  }
`;

export const RESEND_CONFIRMATION = gql`
  mutation resendConfirmation(
    $email: String!
    $password: String!
    $token: String!
  ) {
    resendConfirmation(email: $email, password: $password, token: $token)
  }
`;
