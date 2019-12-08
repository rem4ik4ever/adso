import React from "react";
import gql from "graphql-tag";
import { useMutation, useQuery, useLazyQuery } from "@apollo/react-hooks";
import { setAuthenticationToken, clearTokens } from "../lib/auth";
import {
  IdentityContextProvider,
  useIdentityContext
} from "../hooks/useIdentity";

const CURRENT_USER = gql`
  query me {
    me {
      uuid
      name
      firstName
      lastName
      email
    }
  }
`;

const CHECK_REFRESH_TOKEN = gql`
  mutation refresh {
    refresh
  }
`;

export const withIdentity = WrappedComponent => {
  const InternalWrappedComponent = props => {
    const { onLogin } = useIdentityContext();

    const [checkRefreshToken] = useMutation(CHECK_REFRESH_TOKEN, {
      onCompleted: data => {
        setAuthenticationToken(data.refresh).then(_r => {
          // console.log("refetching");
          refetch();
          // location.reload()
        });
      },
      onError: () => {
        clearTokens();
      }
    });
    const { data, refetch } = useQuery(CURRENT_USER, {
      onCompleted: response => {
        console.log(`Current user data`, response);
        if (!response.me) {
          checkRefreshToken();
        } else {
          onLogin(response.me);
        }
      },
      onError: err => {
        console.err(`Current user Error: ${err}`);
      }
    });
    return <WrappedComponent {...props} />;
  };

  return InternalWrappedComponent;
};
