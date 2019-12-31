import React from "react";
import { Box, Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  footer: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.white
  }
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <Box className={classes.footer}>
      <Container maxWidth="md">
        <Box display="flex" justifyContent="center" p={1}>
          <Typography>Copyright © 2019 AdsoApp</Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
