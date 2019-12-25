import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import { Box, TextField } from "@material-ui/core";
import TrendingFlatIcon from "@material-ui/icons/TrendingFlat";
import { PlaceAutocomplete } from "../Location/PlaceAutocomplete";
import { usePosition } from "../../hooks/usePosition";
import { getAddressFromLatLng } from "../Location/geocoding";

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

const Filters = () => {
  const classes = useStyles();
  const { latitude, longitude } = usePosition();
  const [currentLocation, setCurrentLocation] = useState("");
  useEffect(() => {
    if (latitude && longitude) {
      const result = getAddressFromLatLng(latitude, longitude);
      result.then(response => {
        if (response.length) {
          setCurrentLocation(response[0].formatted_address);
        }
      });
    }
  }, [latitude, longitude]);
  const handleLocationChange = newLocation => {
    setCurrentLocation(newLocation);
  };
  return (
    <Box px={4} py={2}>
      <div>Location</div>
      <PlaceAutocomplete
        label={"Filter by area"}
        value={currentLocation}
        onChange={handleLocationChange}
        variant="standard"
      />
      <div>Price</div>
      <Box display="flex" alignItems="flex-end">
        <TextField
          id="standard-basic"
          label="From"
          type="number"
          inputProps={{ "aria-label": "range-to" }}
        />
        <TrendingFlatIcon className={classes.rangeIcon} />
        <TextField
          id="standard-basic"
          label="To"
          type="number"
          inputProps={{ "aria-label": "range-to" }}
        />
      </Box>
    </Box>
  );
};

export default Filters;
