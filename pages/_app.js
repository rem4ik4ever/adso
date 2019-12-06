import App from "next/app";
import React from "react";
import { ThemeProvider } from "@material-ui/styles";
import theme from "../src/theme";
import { CssBaseline } from "@material-ui/core";
import Head from "next/head";
import { withApollo } from "../src/lib/apollo";
import NavBar from "../src/components/NavBar";
import { IdentityContextProvider } from "../src/hooks/useIdentity";

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
export default withApollo(AdsoApp);
