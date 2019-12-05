import React from "react";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { setAuthenticationToken, clearTokens } from "../lib/auth";

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

const CHECK_REFRESH_TOKEN = gql`
  mutation refresh {
    refresh
  }
`;

const AuthenticationContext = React.createContext();

export const withIdentity = WrappedComponent => {
  const InternalWrappedComponent = props => {
    const [checkRefreshToken] = useMutation(CHECK_REFRESH_TOKEN, {
      onCompleted: data => {
        console.log("Refresh Token data: ", data);
        // setAuthenticationToken(data.refresh);
        // location.reload();
      },
      onError: () => {
        clearTokens();
      }
    });
    const { data } = useQuery(CURRENT_USER, {
      onCompleted: response => {
        console.log(`Current user data`, response);
        if (!response.me) {
          checkRefreshToken();
        }
      },
      onError: err => {
        console.err(`Current user Error: ${err}`);
      }
    });
    return (
      <AuthenticationContext.Provider value={data}>
        <WrappedComponent {...props} />
      </AuthenticationContext.Provider>
    );
  };

  return InternalWrappedComponent;
};
