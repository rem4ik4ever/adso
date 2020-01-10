import React from "react";
import { Box, Paper, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useFilters } from "../../src/hooks/useFilters";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import Search from "../../src/components/Post/Search";
import { PostList } from "../../src/components/Post/PostList";
import { FLEX_SEARCH_POSTS } from "../../src/graphql/postResolvers";

const useStyles = makeStyles(theme => ({
  image: {
    width: 120
  },
  container: {
    [theme.breakpoints.down("sm")]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
    }
  }
}));
const Rentals = () => {
  const classes = useStyles();
  const router = useRouter();
  const filters = useFilters(router.query);
  return (
    <div>
      <Head>
        <title>Rentals</title>
      </Head>
      <Container maxWidth="md" className={classes.container}>
        <Search placeholder="Filter" />
        <Box mt={2}>
          <PostList
            filters={filters}
            query={FLEX_SEARCH_POSTS}
            categoryId={"2"}
            layout="list"
          />
        </Box>
      </Container>
    </div>
  );
};

export default Rentals;
