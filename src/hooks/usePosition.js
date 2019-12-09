import React, { useState, useEffect } from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";

export const usePosition = () => {
  const [position, setPosition] = useState({});
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

    const watcher = geo.watchPosition(onChange, onError);

    return () => geo.clearWatch(watcher);
  }, []);

  return {
    ...position,
    error
  };
};

const MapContainer = props => {
  console.log("props", props);
  const onMarkerClick = data => {
    console.log("marker", data);
  };

  const onInfoWindowClose = data => {
    console.log("info close", data);
  };
  return (
    <Map
      initialCenter={{
        lat: props.latitude,
        lng: props.longitude
      }}
      google={props.google}
      zoom={14}
    >
      <Marker onClick={onMarkerClick} name={"Current location"} />

      <InfoWindow onClose={onInfoWindowClose}>
        <div>Some good place!</div>
        {/* <div>
          <h1>{state.selectedPlace.name}</h1>
        </div> */}
      </InfoWindow>
    </Map>
  );
};

export const GoogleMap = GoogleApiWrapper({
  apiKey: process.env.GOOGLE_MAPS_API_KEY
})(MapContainer);

//AIzaSyCK3IXFOHFx-vPMjUQBFE38QDZWntXgEGw
