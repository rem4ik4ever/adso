import React from "react";
import Head from "next/head";
import NavBar from "../components/NavBar";

const Home = () => (
  <div>
    <Head>
      <title>Home</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <NavBar />
  </div>
);

export default Home;
