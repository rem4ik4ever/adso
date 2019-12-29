import React, { useState, useEffect } from "react";

export const usePosition = () => {
  const [position, setPosition] = useState({
    latitude: null,
    longitude: null
  });
  const [error, setError] = useState(null);

  const onChange = ({ coords }) => {
    setPosition({
      latitude: coords.latitude,
      longitude: coords.longitude
    });
  };

  const onError = error => {
    setError(error.message);
  };

  useEffect(() => {
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
