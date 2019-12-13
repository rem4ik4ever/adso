import React from "react";
import { usePosition } from "../hooks/usePosition";
import { GoogleMap } from "./Location/GoogleMap";
import { PlaceAutocomplete } from "./Location/PlaceAutocomplete";

export const PostLocationForm = () => {
  const { longitude, latitude, error } = usePosition();
  return (
    <div>
      <PlaceAutocomplete />
      {longitude && latitude && (
        <GoogleMap latitude={latitude} longitude={longitude} />
      )}
    </div>
  );
};