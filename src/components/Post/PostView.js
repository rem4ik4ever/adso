import React from "react";
import { Box, Typography, Paper } from "@material-ui/core";
import { useQuery } from "@apollo/react-hooks";
import { GET_POST } from "../../graphql/postResolvers";
import { makeStyles } from "@material-ui/styles";
import ImageSlider from "./ImageSlider";
import Head from "next/head";
import { PostMap } from "../PostMap";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(1),
    margin: theme.spacing(1)
  }
}));

const PostView = ({ id }) => {
  const { data, loading, error } = useQuery(GET_POST, {
    variables: { id }
  });
  if (loading) return "Loading...";
  const post = data.getPost;
  // const classes = useStyles();
  return (
    <Box>
      <Head>
        <link
          rel="stylesheet"
          type="text/css"
          charset="UTF-8"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
      </Head>
      <Paper>
        <ImageSlider images={post.images} />
        <Typography>{post.title}</Typography>
        <div dangerouslySetInnerHTML={{ __html: post.description }} />
        <Box position="relative">
          <PostMap longitude={post.longitude} latitude={post.latitude} />
        </Box>
      </Paper>
    </Box>
  );
};

export default PostView;
