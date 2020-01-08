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
import Link from "next/link";

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
      <Box
        mt={1}
        display="flex"
        overflow="auto"
        pb={1}
        justifyContent={{ sm: "center" }}
      >
        <div className={classes.category}>
          <Link href="/c/all">
            <IconButton className={classes.categoryButton} color="primary">
              <Storefront />
            </IconButton>
          </Link>
          <Typography className={classes.categoryTitle}>All</Typography>
        </div>
        <div className={classes.category}>
          <Link href="/c/electronics">
            <IconButton className={classes.categoryButton} color="primary">
              <Computer />
            </IconButton>
          </Link>
          <Typography className={classes.categoryTitle}>Electronics</Typography>
        </div>
        <div className={classes.category}>
          <Link href="/c/cars">
            <IconButton className={classes.categoryButton} color="primary">
              <DriveEta />
            </IconButton>
          </Link>
          <Typography className={classes.categoryTitle}>Cars</Typography>
        </div>
        <div className={classes.category}>
          <Link href="/c/rentals">
            <IconButton className={classes.categoryButton} color="primary">
              <HomeWork />
            </IconButton>
          </Link>
          <Typography className={classes.categoryTitle}>Rentals</Typography>
        </div>
        <div className={classes.category}>
          <Link href="/c/furniture">
            <IconButton className={classes.categoryButton} color="primary">
              <Deck />
            </IconButton>
          </Link>
          <Typography className={classes.categoryTitle}>Furniture</Typography>
        </div>
      </Box>
    </Box>
  );
};

export default Categories;
