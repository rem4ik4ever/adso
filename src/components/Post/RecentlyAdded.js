import React from "react";
import { Typography, Container, Box } from "@material-ui/core";
import { PostScrollCard } from "./PostScrollCard";
import { useQuery } from "@apollo/react-hooks";
import { ALL_POSTS } from "../../graphql/postResolvers";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 100
  }
}));

const RecentlyAdded = () => {
  const classes = useStyles();
  const { data, loading } = useQuery(ALL_POSTS, {
    variables: {
      perPage: 10
    }
  });
  if (loading) return "Loading...";
  console.log("data", data);
  return (
    <Box>
      <Typography variant="h5" className={classes.title}>
        Recently added
      </Typography>
      <Box display="flex" overflow="auto">
        {data.allPosts.data.map((post, idx) => (
          <PostScrollCard post={post} key={idx} />
        ))}
      </Box>
    </Box>
  );
};

export default RecentlyAdded;
