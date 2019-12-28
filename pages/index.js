import React, { useState, useEffect } from "react";
import Head from "next/head";
import { PostList } from "../src/components/Post/PostList";
import { Container, Box } from "@material-ui/core";
import ActionsList from "../src/components/Post/ActionsList";
import { makeStyles } from "@material-ui/styles";
import Search from "../src/components/Post/Search";
import { useRouter } from "next/router";

const useStyles = makeStyles(theme => ({
  container: {
    [theme.breakpoints.down("sm")]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
    }
  }
}));

const Home = () => {
  const classes = useStyles();
  const [filters, setFilters] = useState({});
  const router = useRouter();
  useEffect(() => {
    let newFilters = {};
    if (router.query.search) {
      newFilters.searchTerm = router.query.search;
    }
    if (router.query.location) {
      newFilters.location = {
        latitude: +router.query.location[0],
        longitude: +router.query.location[1],
        distance: +router.query.location[2]
      };
    }
    if (router.query.priceRange) {
      newFilters.priceRange = {
        from: +router.query.priceRange[0],
        to: +router.query.priceRange[1]
      };
    }
    setFilters(newFilters);
  }, [router.query]);
  return (
    <div>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxWidth="md" className={classes.container}>
        <Box>
          <Search placeholder="Looking for something?" />
        </Box>
        <Box display="flex">
          <ActionsList />
          <PostList filters={filters} />
        </Box>
      </Container>
    </div>
  );
};

export default Home;
