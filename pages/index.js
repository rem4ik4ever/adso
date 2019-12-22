import React from "react";
import Head from "next/head";
import { PostList } from "../src/components/Post/PostList";
import { Container, Box } from "@material-ui/core";
import ActionsList from "../src/components/Post/ActionsList";

const Home = () => {
  return (
    <div>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Hello /> */}
      <Container maxWidth="md">
        <Box display="flex">
          <ActionsList />
          <PostList />
          <Box></Box>
        </Box>
      </Container>
    </div>
  );
};

export default Home;
