import React from "react";

export const useAddress = (lat, lng) => {
  const [addressOptions, setAddress] = React.useState([]);
  React.useEffect(() => {
    if (lat && lng) {
      const geocoder = new google.maps.Geocoder();
      console.log(geocoder);
      geocoder.geocode(
        {
          location: {
            lat,
            lng
          }
        },
        (result, status) => {
          setAddress(result);
          console.log("Result", result);
          console.log("status", status);
        }
      );
    }
  }, [lat, lng]);
  if (addressOptions.length > 0) {
    return addressOptions[0].formatted_address;
  }
  return "";
};
