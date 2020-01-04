import React from "react";
import PostEditForm from "../../src/components/Post/PostEditForm";
import { useQuery } from "@apollo/react-hooks";
import { GET_POST } from "../../src/graphql/postResolvers";
import { useRouter } from "next/router";

const EditPost = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading, error } = useQuery(GET_POST, {
    variables: {
      id
    }
  });
  if (loading) return "";
  return <PostEditForm post={data.getPost} />;
};

export default EditPost;
