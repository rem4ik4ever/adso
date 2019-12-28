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
  const [page, setPage] = useState(1);
  const [after, setAfter] = useState("");
  const fetch = React.useMemo(
    () =>
      debounce(filters => {
        loadMore(filters);
      }, 200),
    []
  );

  useEffect(() => {
    setAfter("");
    setState([]);
    fetch(filters);
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
        setState(response.postsByFlexSearch.data);
        setAfter(response.postsByFlexSearch.after);
      }
    }
  });
  const loadMore = ({ filters }) => {
    fetchMore({
      variables: {
        perPage: PER_PAGE,
        searchTerm: filters.searchTerm || "",
        location: filters.location || null,
        priceRange: filters.priceRange || null,
        after
      },
      updateQuery: (prev, { fetchMoreResult, ...rest }) => {
        if (!fetchMoreResult) return prev;
        setState([...posts, ...fetchMoreResult.postsByFlexSearch.data]);
        setAfter(fetchMoreResult.postsByFlexSearch.after);
      }
    });
  };

  if (loading) return "Loading posts";
  if (error) {
    console.error(error);
  }

  return (
    <Container maxWidth="sm" className={classes.container}>
      {posts.map(post => (
        <PostCard key={post.uuid} post={post} />
      ))}
      {after !== "" && (
        <Box display="flex" justifyContent="center" m="16px">
          <Button onClick={loadMore} variant="outlined" color="secondary">
            Load more
          </Button>
        </Box>
      )}
    </Container>
  );
};
