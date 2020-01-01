import React from "react";
import Section from "./Section";
import { Box, IconButton, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import {
  Storefront,
  Computer,
  Deck,
  DriveEta,
  HomeWork
} from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  category: {
    // border: "1px solid #ccc",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  },
  categoryButton: {
    border: `2px solid ${theme.palette.primary.main}`
  },
  categoryTitle: {
    marginTop: theme.spacing(1),
    fontSize: ".9rem",
    fontWeight: 200
  }
}));

const Categories = () => {
  const classes = useStyles();
  return (
    <Box mt={2}>
      <Section label={"Browse by Category"}>
        <Box mt={1} display="flex" overflow="auto" pt={2} pb={1}>
          <div className={classes.category}>
            <IconButton className={classes.categoryButton} color="primary">
              <Storefront />
            </IconButton>
            <Typography className={classes.categoryTitle}>All</Typography>
          </div>
          <div className={classes.category}>
            <IconButton className={classes.categoryButton} color="primary">
              <Computer />
            </IconButton>
            <Typography className={classes.categoryTitle}>
              Electronics
            </Typography>
          </div>
          <div className={classes.category}>
            <IconButton className={classes.categoryButton} color="primary">
              <DriveEta />
            </IconButton>
            <Typography className={classes.categoryTitle}>Cars</Typography>
          </div>
          <div className={classes.category}>
            <IconButton className={classes.categoryButton} color="primary">
              <HomeWork />
            </IconButton>
            <Typography className={classes.categoryTitle}>Rentals</Typography>
          </div>
          <div className={classes.category}>
            <IconButton className={classes.categoryButton} color="primary">
              <Deck />
            </IconButton>
            <Typography className={classes.categoryTitle}>Furniture</Typography>
          </div>
        </Box>
      </Section>
    </Box>
  );
};

export default Categories;
