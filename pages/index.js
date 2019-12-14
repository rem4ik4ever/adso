import React from "react";
import Head from "next/head";
import { PostList } from "../src/components/Post/PostList";

const Home = () => {
  return (
    <div>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Hello /> */}
      <PostList />
    </div>
  );
};

export default Home;
