import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";

const DistanceSelect = ({ value, onChange }) => {
  const distances = [30, 50, 100, 150, 200];
  return (
    <FormControl>
      <InputLabel id="select-distance">Within</InputLabel>
      <Select
        labelId="select-distance"
        id="select-distance-control"
        value={value}
        onChange={onChange}
      >
        {distances.map((distance, index) => (
          <MenuItem value={distance} key={index}>
            {distance}km
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DistanceSelect;
