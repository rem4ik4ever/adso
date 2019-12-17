import React from "react";
import { GoogleMap } from "./Location/GoogleMap";

export const PostMap = ({ latitude, longitude }) => {
  if (!latitude || !longitude) return <div />;
  return <GoogleMap latitude={latitude} longitude={longitude} />;
};
