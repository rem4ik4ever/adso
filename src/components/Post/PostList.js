import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Box, Typography } from "@material-ui/core";
import { ALL_POSTS } from "../../graphql/postResolvers";
import { PostCard } from "./PostCard";

export const PostList = () => {
  const [posts, setState] = useState([]);
  const [page, setPage] = useState(1);
  const [after, setAfter] = useState("");
  const { data, loading, error } = useQuery(ALL_POSTS, {
    variables: {
      perPage: 20,
      after
    },
    onCompleted: response => {
      console.log("response", response);
      setState(response.allPosts.data);
      setAfter(response.allPosts.after);
    }
  });
  if (loading) return "Loading posts";
  if (error) {
    console.error(error);
  }
  return (
    <Box>
      <Typography>This is Post list</Typography>
      <div>
        {posts.map(post => (
          <PostCard key={post.uuid} post={post} />
        ))}
      </div>
    </Box>
  );
};
