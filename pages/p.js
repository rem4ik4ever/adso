import React from "react";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import PostView from "../src/components/Post/PostView";
const Post = () => {
  const router = useRouter();
  const { id } = router.query;

  return <PostView id={id} />;
};
export default Post;
