import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  IconButton,
  Container
} from "@material-ui/core";
import { useQuery } from "@apollo/react-hooks";
import { GET_POST } from "../../graphql/postResolvers";
import { makeStyles } from "@material-ui/styles";
import ImageSlider from "./ImageSlider";
import Head from "next/head";
import { PostMap } from "../PostMap";
import { Message, Phone } from "@material-ui/icons";
import { PoseGroup } from "react-pose";
import { Appear } from "../../animations/appear";

const useStyles = makeStyles(theme => ({
  paper: {
    // margin: theme.spacing(1),
    [theme.breakpoints.down("sm")]: {
      boxShadow: "0 0 2px #808080",
      marginTop: -theme.spacing(3),
      borderTopLeftRadius: theme.spacing(3),
      borderTopRightRadius: theme.spacing(3)
    },
    [theme.breakpoints.up("sm")]: {
      left: theme.spacing(1),
      minWidth: 320
    },
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
  },
  root: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column"
    },
    [theme.breakpoints.up("sm")]: {
      marginTop: theme.spacing(1),
      flexDirection: "row",
      alignItems: "flex-start"
    }
  },
  container: {
    [theme.breakpoints.down("sm")]: {
      padding: 0
    }
  },
  imageSlider: {
    // margin: theme.spacing(1),
    [theme.breakpoints.down("sm")]: {
      top: 48
    },
    [theme.breakpoints.up("sm")]: {
      top: 48 + theme.spacing(1)
    },
    position: "sticky"
    // height: "fit-content"
  }
}));

const PostView = ({ id }) => {
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setAnimate(true);
    }, 400);
  }, []);
  const classes = useStyles();
  const { data, loading, error } = useQuery(GET_POST, {
    variables: { id }
  });
  if (loading) return "Loading...";
  const post = data.getPost;
  return (
    <Container maxWidth="md" className={classes.container}>
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
        <title>{post.title}</title>
      </Head>
      <Box className={classes.root}>
        <PoseGroup>
          {animate && [
            <Appear key="slider" i={0} className={classes.imageSlider}>
              <Box maxWidth={"600px"}>
                <ImageSlider images={post.images} />
              </Box>
            </Appear>,
            <Appear key="form" i={1}>
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
                        <Typography
                          className={classes.postedBy}
                          variant="caption"
                        >
                          posted by
                        </Typography>
                        <Typography variant="subtitle1">
                          {post.author.name}
                        </Typography>
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
                    <Typography className={classes.title}>
                      {post.title}
                    </Typography>
                  </Box>
                  <Box mt="16px">
                    <Typography className={classes.descriptionTitle}>
                      Price
                    </Typography>
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
                      <PostMap
                        longitude={post.longitude}
                        latitude={post.latitude}
                      />
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Appear>
          ]}
        </PoseGroup>
      </Box>
    </Container>
  );
};

export default PostView;
