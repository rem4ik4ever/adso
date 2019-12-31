import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import {
  Box,
  Typography,
  Button,
  Container,
  GridList,
  GridListTile
} from "@material-ui/core";
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
  const [loading, setLoading] = useState(true);
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
      fetch(filters);
    }
  }, [filters]);

  const { data, error, fetchMore } = useQuery(FLEX_SEARCH_POSTS, {
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
  const loadMore = data => {
    let variables = {
      perPage: PER_PAGE,
      after
    };
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
    setLoading(true);
    fetchMore({
      variables,
      updateQuery: (prev, { fetchMoreResult }) => {
        setLoading(false);
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
    <Box>
      {posts.length == 0 && <Typography>Sorry, no results</Typography>}
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        flexWrap={{ xs: "none", sm: "wrap" }}
        justifyContent="center"
      >
        {posts.map(post => (
          <PostCard key={post.uuid} post={post} />
        ))}
      </Box>
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
    </Box>
  );
};
