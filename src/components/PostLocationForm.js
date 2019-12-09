import React from "react";
import { usePosition, GoogleMap } from "../hooks/usePosition";

export const PostLocationForm = () => {
  const { longitude, latitude, error } = usePosition();
  return (
    <div>
      <ul>
        <li>longitude: {longitude}</li>
        <li>latitude: {latitude}</li>
      </ul>
      {longitude && latitude && (
        <GoogleMap latitude={latitude} longitude={longitude} />
      )}
    </div>
  );
};
