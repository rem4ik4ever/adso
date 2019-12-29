import React, { useEffect, useState } from "react";
import Head from "next/head";
import CreatePost from "../src/components/PostForm";
import { useIdentityContext } from "../src/hooks/useIdentity";
import SignIn from "./sign-in";
import { Typography, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Appear } from "../src/animations/appear";
import { PoseGroup } from "react-pose";

const useStyles = makeStyles(theme => ({
  title: {
    textTransform: "uppercase",
    fontWeight: 300
  }
}));

const PostAd = () => {
  const classes = useStyles();
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setAnimate(true);
    }, 400);
  }, []);
  const { isLoggedIn } = useIdentityContext();
  if (!isLoggedIn) return <SignIn />;
  return (
    <div>
      <Head>
        <title>Post Ad</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PoseGroup>
        {animate && [
          <Appear i={0} key="title">
            <Box m={3} textAlign="center">
              <Typography variant="h4" className={classes.title}>
                post ad
              </Typography>
            </Box>
          </Appear>,
          <Appear key="form" i={1}>
            <CreatePost />
          </Appear>
        ]}
      </PoseGroup>
    </div>
  );
};

export default PostAd;
