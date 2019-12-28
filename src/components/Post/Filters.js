import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import { Box, TextField } from "@material-ui/core";
import TrendingFlatIcon from "@material-ui/icons/TrendingFlat";
import { PlaceAutocomplete } from "../Location/PlaceAutocomplete";
import { usePosition } from "../../hooks/usePosition";
import { getAddressFromLatLng } from "../Location/geocoding";
import DistanceSelect from "./DistanceSelect";

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

const Filters = ({ onChange, filters }) => {
  const classes = useStyles();
  const { latitude, longitude } = usePosition();
  const [currentLocation, setCurrentLocation] = useState("");
  const [distance, setDistance] = useState(30);
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
    onChange("location", newLocation);
  };
  return (
    <Box px={{ md: 4 }} py={2}>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Box display="flex" flexGrow="1">
          <PlaceAutocomplete
            label={"Filter by area"}
            value={currentLocation}
            onChange={handleLocationChange}
            variant="standard"
          />
        </Box>
        <DistanceSelect
          value={distance}
          onChange={e => {
            e.preventDefault();
            setDistance(e.target.value);
            onChange("distance", +e.target.value);
          }}
        />
      </Box>
      <Box display="flex" alignItems="flex-end">
        <TextField
          id="standard-basic"
          label="Price from"
          type="number"
          inputProps={{ "aria-label": "range-to" }}
          onChange={e => onChange("fromPrice", +e.target.value)}
        />
        <TrendingFlatIcon className={classes.rangeIcon} />
        <TextField
          id="standard-basic"
          label="To"
          type="number"
          inputProps={{ "aria-label": "range-to" }}
          onChange={e => onChange("toPrice", +e.target.value)}
        />
      </Box>
    </Box>
  );
};

export default Filters;
