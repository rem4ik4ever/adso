import React, { useState } from "react";
import Head from "next/head";
import { PostList } from "../src/components/Post/PostList";
import { Container, Box } from "@material-ui/core";
import ActionsList from "../src/components/Post/ActionsList";
import { makeStyles } from "@material-ui/styles";
import Search from "../src/components/Post/Search";
import { getLatLngFromAddress } from "../src/components/Location/geocoding";

const useStyles = makeStyles(theme => ({
  container: {
    [theme.breakpoints.down("sm")]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
    }
  }
}));

const getLocationFromFilters = async loc => {
  let location = null;
  if (loc) {
    const { latitude, longitude } = await getLatLngFromAddress(loc);
    if (latitude && longitude) {
      location = {
        latitude,
        longitude
      };
    }
  }
  return location;
};

const Home = () => {
  const classes = useStyles();
  const [filters, setFilters] = useState({});
  const handleFilters = (prop, value) => {
    let newFilters = { ...filters };
    if (prop == "location") {
      getLocationFromFilters(value).then(({ latitude, longitude }) => {
        newFilters.location = {
          ...newFilters.location,
          latitude,
          longitude
        };
        if (!newFilters.distance) {
          newFilters.location.distance = 30;
        }
        setFilters(newFilters);
      });
    } else if (prop == "distance") {
      newFilters.location = {
        ...newFilters.location,
        distance: value
      };
      setFilters(newFilters);
    } else if (prop == "priceFrom") {
      newFilters.priceRange = {
        ...newFilters.priceRange,
        from: value
      };
      setFilters(newFilters);
    } else if (prop == "priceTo") {
      newFilters.priceRange = {
        ...newFilters.priceRange,
        to: value
      };
      setFilters(newFilters);
    } else if (prop == "searchTerm") {
      newFilters.searchTerm = value;
      setFilters(newFilters);
    }
  };
  return (
    <div>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxWidth="md" className={classes.container}>
        <Box>
          <Search
            placeholder="Looking for something?"
            onChange={handleFilters}
          />
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
