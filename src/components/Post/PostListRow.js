import React from "react";
import { Paper, Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import moment from "moment";
import PostDescription from "./PostDescription";

const useStyles = makeStyles(theme => ({
  image: {
    width: "150px"
  },
  date: {
    fontSize: "0.85rem",
    color: theme.palette.sub.main
  },
  title: {
    fontWeight: 300
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
              <Typography className={classes.title}>{post.title}</Typography>
              <Typography className={classes.date}>
                {moment(+post.createdAt).fromNow()}
              </Typography>
            </Box>
            <PostDescription content={post.description} trimHeight={50} />
          </Box>
          <Box>Actions</Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default PostListRow;
