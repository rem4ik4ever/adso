import React from "react";
import Head from "next/head";
import CreatePost from "../src/components/PostForm";
import { useIdentityContext } from "../src/hooks/useIdentity";
import SignIn from "./sign-in";

const PostAd = () => {
  const { isLoggedIn } = useIdentityContext();
  if (!isLoggedIn) return <SignIn />;
  return (
    <div>
      <Head>
        <title>Post Ad</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CreatePost />
    </div>
  );
};

export default PostAd;
