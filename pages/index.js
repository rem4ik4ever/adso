import React from "react";
import Head from "next/head";
import NavBar from "../src/components/NavBar";
import Hello from "../src/components/Hello";
import CreatePost from "../src/components/PostForm";

const Home = () => (
  <div>
    <Head>
      <title>Home</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    {/* <Hello /> */}
    <CreatePost />
  </div>
);

export default Home;
