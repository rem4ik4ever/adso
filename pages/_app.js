import App from "next/app";
import React from "react";
import { ThemeProvider } from "@material-ui/styles";
import theme from "../src/theme";
import { CssBaseline } from "@material-ui/core";
import Head from "next/head";
import { withApollo } from "../src/lib/apollo";

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
      <div>
        <Head>
          <title>Adso App</title>
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </div>
    );
  }
}
export default withApollo(AdsoApp);
