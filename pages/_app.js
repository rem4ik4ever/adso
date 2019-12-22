import App from "next/app";
import React from "react";
import { ThemeProvider } from "@material-ui/styles";
import theme from "../src/theme";
import { CssBaseline, Container } from "@material-ui/core";
import Head from "next/head";
import { withApollo } from "../src/lib/apollo";
import NavBar from "../src/components/NavBar";
import { IdentityContextProvider } from "../src/hooks/useIdentity";
import { GoogleApiWrapper } from "google-maps-react";

class AdsoApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <IdentityContextProvider>
        <Head>
          <title>Adso App</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
          />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <NavBar />
          <Component {...pageProps} />
        </ThemeProvider>
      </IdentityContextProvider>
    );
  }
}
export default GoogleApiWrapper({
  apiKey: process.env.NETLIFY_DEV
    ? process.env.GOOGLE_MAPS_DEV_API_KEY
    : process.env.GOOGLE_MAPS_API_KEY
})(withApollo(AdsoApp));
