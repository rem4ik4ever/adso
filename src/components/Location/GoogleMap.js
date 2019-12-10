import React, { useState, useEffect } from "react";
import { Map, InfoWindow, Marker } from "google-maps-react";

export const GoogleMap = props => {
  useEffect(() => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      {
        location: {
          lat: props.latitude,
          lng: props.longitude
        }
      },
      (result, status) => {
        console.log("Result", result);
        console.log("status", status);
      }
    );
  }, []);
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
      google={google}
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
