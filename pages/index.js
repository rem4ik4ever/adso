import React from "react";
import Head from "next/head";
import { PostList } from "../src/components/Post/PostList";
import { Container, Box } from "@material-ui/core";
import ActionsList from "../src/components/Post/ActionsList";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  container: {
    [theme.breakpoints.down("sm")]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
    }
  }
}));

const Home = () => {
  const classes = useStyles();
  return (
    <div>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Hello /> */}
      <Container maxWidth="md" className={classes.container}>
        <Box display="flex">
          <ActionsList />
          <PostList />
        </Box>
      </Container>
    </div>
  );
};

export default Home;
