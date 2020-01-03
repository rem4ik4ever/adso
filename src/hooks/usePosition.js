import React, { useState, useEffect } from "react";
import { set, get } from "local-storage";

export const usePosition = () => {
  const [position, setPosition] = useState({
    latitude: null,
    longitude: null
  });
  const [error, setError] = useState(null);

  const onChange = ({ coords }) => {
    set("latitude", coords.latitude);
    set("longitude", coords.longitude);
    setPosition({
      latitude: coords.latitude,
      longitude: coords.longitude
    });
  };

  const onError = error => {
    setError(error.message);
  };

  useEffect(() => {
    if (get("latitude") && get("longitude")) {
      setPosition({
        latitude: get("latitude"),
        longitude: get("longitude")
      });
      return;
    }
    const geo = navigator.geolocation;
    if (!geo) {
      setError("Geolocation is not supported");
      return;
    }
    geo.getCurrentPosition(onChange, onError);
    // const watcher = geo.watchPosition(onChange, onError);

    // return () => geo.clearWatch(watcher);
  }, []);

  return {
    ...position,
    error
  };
};
