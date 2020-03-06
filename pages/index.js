import React from "react";
import Head from "next/head";
import { Container, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import Search from "src/components/Post/Search";
import { useRouter } from "next/router";
import RecentlyAdded from "src/components/Post/RecentlyAdded";
import Categories from "src/components/Post/Categories";
import { FLEX_SEARCH_POSTS } from "src/graphql/postResolvers";
import { useFilters } from "src/hooks/useFilters";
import { PostList } from "src/components/Post/PostList";
import { usePosition } from "../src/hooks/usePosition";

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
  const router = useRouter();
  const filters = useFilters(router.query);
  return (
    <div>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxWidth="md" className={classes.container}>
        <Search placeholder="Looking for something?" />
        <Box display="flex" flexDirection="column">
          <Categories />
          <RecentlyAdded />
          {/* <ActionsList /> */}
          <PostList filters={filters} query={FLEX_SEARCH_POSTS} />
        </Box>
      </Container>
    </div>
  );
};

export default Home;
