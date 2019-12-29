import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import { Box, TextField } from "@material-ui/core";
import TrendingFlatIcon from "@material-ui/icons/TrendingFlat";
import { PlaceAutocomplete } from "../Location/PlaceAutocomplete";
import { usePosition } from "../../hooks/usePosition";
import { getAddressFromLatLng } from "../Location/geocoding";
import DistanceSelect from "./DistanceSelect";
import { useRouter } from "next/router";

const useStyles = makeStyles(theme => ({
  paper: {
    // paddingTop: 33,
    // marginTop: -50
  },
  rangeIcon: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}));

const Filters = ({ onChange }) => {
  const classes = useStyles();
  const router = useRouter();
  const { latitude, longitude } = usePosition();
  const [currentLocation, setCurrentLocation] = useState("");
  const [distance, setDistance] = useState(30);
  const [priceFrom, setFromPrice] = useState(0);
  const [priceTo, setToPrice] = useState("");
  useEffect(() => {
    if (router.query.priceRange) {
      setFromPrice(+router.query.priceRange[0]);
      setToPrice(+router.query.priceRange[1]);
    }
    if (router.query.location) {
      if (router.query.location[0] && router.query.location[1]) {
        const latitude = +router.query.location[0];
        const longitude = +router.query.location[1];
        getAddressFromLatLng(latitude, longitude).then(response => {
          if (response.length) {
            setCurrentLocation(response[2].formatted_address);
            setDistance(router.query.location[2] || 30);
          }
        });
      }
    } else {
      if (latitude && longitude) {
        getAddressFromLatLng(latitude, longitude).then(response => {
          if (response.length) {
            setCurrentLocation(response[2].formatted_address);
            onChange("location", response[2].formatted_address);
          }
        });
      }
    }
  }, [latitude, longitude]);
  const handleLocationChange = newLocation => {
    setCurrentLocation(newLocation);
    onChange("location", newLocation);
  };
  return (
    <Box px={{ md: 4 }} pt={2}>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Box display="flex" flexGrow="1">
          <PlaceAutocomplete
            label={"Filter by area"}
            value={currentLocation}
            onChange={handleLocationChange}
            variant="standard"
          />
        </Box>
        {currentLocation !== "" && (
          <DistanceSelect
            value={distance}
            onChange={e => {
              e.preventDefault();
              setDistance(e.target.value);
              onChange("distance", +e.target.value);
            }}
          />
        )}
      </Box>
      <Box display="flex" alignItems="flex-end" mt={1}>
        <TextField
          id="standard-basic"
          label="Price from"
          type="number"
          value={priceFrom}
          inputProps={{ "aria-label": "range-to" }}
          onChange={e => {
            setFromPrice(+e.target.value);
            onChange("fromPrice", +e.target.value);
          }}
        />
        <TrendingFlatIcon className={classes.rangeIcon} />
        <TextField
          id="standard-basic"
          label="To"
          type="number"
          value={priceTo}
          inputProps={{ "aria-label": "range-to" }}
          onChange={e => {
            setToPrice(+e.target.value);
            onChange("toPrice", +e.target.value);
          }}
        />
      </Box>
    </Box>
  );
};

export default Filters;
