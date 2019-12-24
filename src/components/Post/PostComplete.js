import React from "react";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh"
  },
  progress: {},
  complete: {
    fontSize: "8rem",
    color: "green"
  },
  done: {
    color: "green"
  }
}));

const PostComplete = ({ complete }) => {
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      {complete ? (
        <CheckCircleOutlineIcon className={classes.complete} />
      ) : (
        <CircularProgress className={classes.progress} size={120} />
      )}
      <Box mt={1}>
        {complete ? (
          <Typography variant="h6" className={classes.done}>
            Done!
          </Typography>
        ) : (
          <Typography variant="h6">Saving</Typography>
        )}
      </Box>
    </Box>
  );
};

export default PostComplete;
