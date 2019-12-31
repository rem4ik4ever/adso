import React from "react";
import { Typography, Box } from "@material-ui/core";
import { PostScrollCard } from "./PostScrollCard";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  sectionCard: {
    backgroundColor: theme.palette.white,
    padding: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      borderRadius: theme.spacing(3),
      boxShadow: `0 0 3px ${theme.palette.shadow.main}`
    }
  },
  title: {
    fontWeight: 100
  }
}));

const Section = ({ posts, label, children }) => {
  const classes = useStyles();
  return (
    <Box className={classes.sectionCard}>
      <Typography variant="h5" className={classes.title}>
        {label}
      </Typography>
      {posts && (
        <Box display="flex" overflow="auto">
          {posts.map((post, idx) => (
            <PostScrollCard post={post} key={idx} />
          ))}
        </Box>
      )}
      {children}
    </Box>
  );
};

export default Section;
