import React from "react";
import PostEditForm from "../../src/components/Post/PostEditForm";
import { useQuery } from "@apollo/react-hooks";
import { GET_EDIT_POST } from "../../src/graphql/postResolvers";
import { useRouter } from "next/router";
import { useIdentityContext } from "../../src/hooks/useIdentity";
import SignIn from "../sign-in";

const EditPost = () => {
  const router = useRouter();
  const { isLoggedIn } = useIdentityContext();
  const { id } = router.query;
  const { data, loading, error } = useQuery(GET_EDIT_POST, {
    variables: {
      id
    }
  });
  if (!isLoggedIn) return <SignIn />;
  if (loading) return "";
  if (!data.getEditPost || error) {
    router.push("/whoops");
    return "";
  }
  return <PostEditForm post={data.getEditPost} />;
};

export default EditPost;
