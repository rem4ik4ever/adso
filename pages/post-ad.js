import React from "react";
import Head from "next/head";
import CreatePost from "../src/components/PostForm";
import { useIdentityContext } from "../src/hooks/useIdentity";
import SignIn from "./sign-in";
import { Typography, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  title: {
    textTransform: "uppercase",
    fontWeight: 300
  }
}));

const PostAd = () => {
  const classes = useStyles();
  const { isLoggedIn } = useIdentityContext();
  if (!isLoggedIn) return <SignIn />;
  return (
    <div>
      <Head>
        <title>Post Ad</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box m={3} textAlign="center">
        <Typography variant="h4" className={classes.title}>
          post ad
        </Typography>
      </Box>
      <CreatePost />
    </div>
  );
};

export default PostAd;
