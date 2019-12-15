import React from "react";
import { Box, Typography } from "@material-ui/core";

const PostView = ({ id }) => {
  return (
    <Box>
      <Typography>Post View {id}</Typography>
    </Box>
  );
};

export default PostView;
