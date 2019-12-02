import React from "react";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";

const CURRENT_USER = gql`
  {
    me {
      uuid
      name
      firstName
      lastName
      email
    }
  }
`;

export const withIdentity = WrappedComponent => {
  const InternalWrappedComponent = props => <WrappedComponent {...props} />;
  const { data, loading, error } = useQuery(CURRENT_USER);
  console.log("current_user", data);

  return InternalWrappedComponent;
};

const LOGIN = gql`
  mutation login($data: LoginInput!) {
    login(data: $data) {
      accessToken
      refreshToken
    }
  }
`;

const loginUser = (email, password) => {
  const [login, { data, loading, error }] = useMutation(LOGIN);
  login({ data: { email, password } });
  return { data, loading, error };
};
