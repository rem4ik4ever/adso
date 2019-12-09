import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Box } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  container: {
    border: "1px solid #dedede",
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1)
  },
  thumbnail: {
    maxWidth: "160px",
    maxHeight: "160px"
  }
}));
export const ImageList = ({ imagesUrls }) => {
  const classes = useStyles();
  return (
    <Box display="flex">
      {imagesUrls.map((url, index) => (
        <Box className={classes.container} key={`img-${index}`}>
          <img className={classes.thumbnail} src={url} />
        </Box>
      ))}
    </Box>
  );
};
