import React from "react";
import { Box, Container } from "@material-ui/core";
import Search from "src/components/Post/Search";
import Head from "next/head";
import { makeStyles } from "@material-ui/styles";
import { MY_ADS } from "src/graphql/postResolvers";
import { PostList } from "src/components/Post/PostList";
import { useRouter } from "next/router";
import { useFilters } from "src/hooks/useFilters";
import { useIdentityContext } from "src/hooks/useIdentity";
import SignIn from "pages/sign-in";

const useStyles = makeStyles(theme => ({
  container: {
    [theme.breakpoints.down("sm")]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
    }
  }
}));

const MyAds = () => {
  const router = useRouter();
  const classes = useStyles();
  const filters = useFilters(router.query);
  const { isLoggedIn } = useIdentityContext();
  if (!isLoggedIn) return <SignIn />;
  return (
    <div>
      <Head>
        <title>My Ads</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxWidth="md" className={classes.container}>
        <Search placeholder="Filter your ads" withAdvanced={false} />
        <Box display="flex" flexDirection="column">
          <PostList query={MY_ADS} filters={filters} />
        </Box>
      </Container>
    </div>
  );
};

export default MyAds;
