import React from "react";
import { Box, Typography, Paper, Avatar, IconButton } from "@material-ui/core";
import { useQuery } from "@apollo/react-hooks";
import { GET_POST } from "../../graphql/postResolvers";
import { makeStyles } from "@material-ui/styles";
import ImageSlider from "./ImageSlider";
import Head from "next/head";
import { PostMap } from "../PostMap";
import { Message, Phone } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  paper: {
    // margin: theme.spacing(1),
    borderTopLeftRadius: theme.spacing(3),
    borderTopRightRadius: theme.spacing(3),
    marginTop: "-20px",
    border: "1px solid #ccc",
    position: "relative"
  },
  postedBy: {
    color: theme.palette.sub.main,
    textTransform: "uppercase",
    fontSize: "0.60rem"
  },
  title: {
    fontSize: "0.87rem",
    fontWeight: "200"
  },
  descriptionTitle: {
    fontSize: "0.66rem",
    fontWeight: "bold",
    textTransform: "uppercase"
  },
  description: {
    fontSize: "0.85rem"
  },
  map: {
    ">div": {
      position: "relative"
    }
  }
}));

const PostView = ({ id }) => {
  const classes = useStyles();
  const { data, loading, error } = useQuery(GET_POST, {
    variables: { id }
  });
  if (loading) return "Loading...";
  const post = data.getPost;
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
      <ImageSlider images={post.images} />
      <Paper className={classes.paper}>
        <Box padding="16px">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center" mb="16px">
              <Avatar>
                {post.author.firstName[0]}
                {post.author.lastName[0]}
              </Avatar>
              <Box ml={"16px"}>
                <Typography className={classes.postedBy} variant="caption">
                  posted by
                </Typography>
                <Typography variant="subtitle1">{post.author.name}</Typography>
              </Box>
            </Box>
            <Box>
              <IconButton color="primary">
                <Message />
              </IconButton>
              <IconButton color="primary">
                <Phone />
              </IconButton>
            </Box>
          </Box>
          <Box>
            <Typography className={classes.title}>{post.title}</Typography>
          </Box>
          <Box mt="16px">
            <Typography className={classes.descriptionTitle}>Price</Typography>
            <Box mt="1em" mb="1em">
              {post.priceInfo.toLowerCase() === "fixed" ? (
                <Typography className={classes.description}>
                  ${post.price}
                </Typography>
              ) : (
                <Typography className={classes.description}>
                  {post.priceInfo}
                </Typography>
              )}
            </Box>
          </Box>
          <Box mt="16px">
            <Typography className={classes.descriptionTitle}>
              Description
            </Typography>
            <div
              className={classes.description}
              dangerouslySetInnerHTML={{ __html: post.description }}
            />
          </Box>
          <Box mt="16px">
            <Typography className={classes.descriptionTitle}>
              We can meet here
            </Typography>
            <Box mt="1em" mb="1em">
              <PostMap longitude={post.longitude} latitude={post.latitude} />
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default PostView;
