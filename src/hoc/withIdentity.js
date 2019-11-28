import React from "react";
import { AppIdentityContext } from "../context/AppIdentityContext";
import { useNetlifyIdentity } from "react-netlify-identity";

/**
 * Attaching Netlify Idendntity
 */
export const withIdentity = WrappedComponent => {
  const InternalWrappedComponent = props => {
    const identityUrl = "https://adso-app.netlify.com";
    const identity = useNetlifyIdentity(identityUrl);
    return <WrappedComponent {...props} identity={identity} />;
  };

  return InternalWrappedComponent;
};
