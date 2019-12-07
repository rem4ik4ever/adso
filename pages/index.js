import React from "react";
import Head from "next/head";
import NavBar from "../src/components/NavBar";
import Hello from "../src/components/Hello";
import CreatePost from "../src/components/PostForm";
import { useIdentityContext } from "../src/hooks/useIdentity";
import SignIn from "./sign-in";

const Home = () => {
  const { isLoggedIn } = useIdentityContext();
  if (!isLoggedIn) return <SignIn />;
  return (
    <div>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Hello /> */}
      <CreatePost />
    </div>
  );
};

export default Home;
