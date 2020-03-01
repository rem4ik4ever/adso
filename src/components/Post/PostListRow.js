import React from "react";
import { Paper, Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import moment from "moment";
import PostDescription from "./PostDescription";
import Link from "next/link";

const useStyles = makeStyles(theme => ({
  image: {
    [theme.breakpoints.up("sm")]: {
      width: "150px"
    },
    [theme.breakpoints.down("sm")]: {
      width: "100px"
    }
  },
  titleDate: {
    [theme.breakpoints.up("sm")]: {
      display: "block"
    },
    [theme.breakpoints.down("sm")]: {
      display: "none"
    },
    fontSize: "0.85rem",
    color: theme.palette.sub.main
  },
  bodyDate: {
    [theme.breakpoints.up("sm")]: {
      display: "none"
    },
    [theme.breakpoints.down("sm")]: {
      display: "block"
    },
    fontSize: "0.85rem",
    color: theme.palette.sub.main
  },
  title: {
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.9rem"
    },
    fontWeight: 300,
    cursor: "pointer",
    // transition: "all 200ms ease-in-out",
    "&:hover": {
      color: theme.palette.primary.light
    }
  },
  description: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  priceTitle: {
    marginRight: theme.spacing(1),
    fontSize: ".9rem",
    fontWeight: 600,
    color: theme.palette.font.subtitle
  },
  price: {
    fontSize: "1.1rem",
    color: theme.palette.primary.main,
    fontWeight: 500
  }
}));

const PostListRow = ({ post }) => {
  const classes = useStyles();
  return (
    <Box mt={1}>
      <Paper>
        <Box display="flex">
          <Box minHeight={"150px"} display="flex" alignItems="center" p={1}>
            <img src={post.images[0]} className={classes.image} />
          </Box>
          <Box flexGrow="1">
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              p={1}
            >
              <Link href={`/p?id=${post.id}`}>
                <Typography className={classes.title}>
                  {post.title.slice(0, 60)}{" "}
                  {post.title.length > 60 ? "..." : ""}
                </Typography>
              </Link>
              <Typography className={classes.titleDate}>
                {moment(post.createdDate).fromNow()}
              </Typography>
            </Box>
            <Box p={1}>
              {post.priceInfo == "Fixed" ? (
                <Box display="flex" alignItems="center">
                  <Typography className={classes.priceTitle}>Price:</Typography>
                  <Typography className={classes.price}>
                    ${post.price}
                  </Typography>
                </Box>
              ) : (
                <Typography className={classes.priceTitle}>
                  {post.priceInfo}
                </Typography>
              )}
            </Box>
            <Box p={1}>
              <Typography className={classes.bodyDate}>
                {moment(post.createdDate).fromNow()}
              </Typography>
            </Box>
            <Box p={1} className={classes.description}>
              <PostDescription
                id={post.id}
                content={post.description}
                trimHeight={50}
              />
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default PostListRow;
