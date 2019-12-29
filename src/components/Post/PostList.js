import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Box, Typography, Button, Container } from "@material-ui/core";
import { ALL_POSTS, FLEX_SEARCH_POSTS } from "../../graphql/postResolvers";
import { PostCard } from "./PostCard";
import { makeStyles } from "@material-ui/styles";
import { throttle, debounce } from "lodash";

const PER_PAGE = 10;

const useStyles = makeStyles(theme => ({
  container: {
    padding: 0
  }
}));

export const PostList = filters => {
  const classes = useStyles();
  const [posts, setState] = useState([]);
  const [after, setAfter] = useState("");
  const fetch = React.useMemo(
    () =>
      debounce(filters => {
        loadMore(filters);
      }, 200),
    []
  );

  useEffect(() => {
    if (filters) {
      setAfter("");
      setState([]);
      fetch(filters);
    }
  }, [filters]);

  const { data, loading, error, fetchMore } = useQuery(FLEX_SEARCH_POSTS, {
    variables: {
      perPage: PER_PAGE,
      searchTerm: filters.searchTerm || "",
      location: filters.location,
      priceRange: filters.priceRange
    },
    onCompleted: response => {
      if (response) {
        console.log("Initial completed");
        setState(response.postsByFlexSearch.data);
        setAfter(response.postsByFlexSearch.after);
      }
    }
  });
  const loadMore = data => {
    let variables = {
      perPage: PER_PAGE,
      after
    };
    console.log("FILT", data.filters);
    const filters = data.filters;
    if (filters) {
      variables.searchTerm = filters.searchTerm || "";
      if (filters.location) {
        variables.location = filters.location;
      }
      if (filters.priceRange) {
        variables.priceRange = filters.priceRange || null;
      }
    }
    console.log("VARS", variables);
    fetchMore({
      variables,
      updateQuery: (prev, { fetchMoreResult, ...rest }) => {
        console.log("fetchMoreResult", fetchMoreResult);
        if (!fetchMoreResult) return prev;
        setState([...posts, ...fetchMoreResult.postsByFlexSearch.data]);
        setAfter(fetchMoreResult.postsByFlexSearch.after);
      },
      notifyOnNetworkStatusChange: true
    });
  };

  if (loading) return "Loading posts";
  if (error) {
    console.error(error);
  }

  return (
    <Container maxWidth="sm" className={classes.container}>
      {posts.length == 0 && <Typography>Sorry, no results</Typography>}
      {posts.map(post => (
        <PostCard key={post.uuid} post={post} />
      ))}
      {after !== "" && (
        <Box display="flex" justifyContent="center" m="16px">
          <Button
            onClick={e => loadMore(filters)}
            variant="outlined"
            color="secondary"
          >
            Load more
          </Button>
        </Box>
      )}
    </Container>
  );
};
