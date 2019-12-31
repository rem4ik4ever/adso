import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { ALL_POSTS } from "../../graphql/postResolvers";
import Section from "./Section";
import { Box } from "@material-ui/core";

const RecentlyAdded = () => {
  const { data, loading, error } = useQuery(ALL_POSTS, {
    variables: {
      perPage: 10
    }
  });
  if (loading) return "Loading...";
  if (error) return "";
  return (
    <Box mt={2}>
      <Section posts={data.allPosts.data} label={"Recently Added"} />;
    </Box>
  );
};

export default RecentlyAdded;
