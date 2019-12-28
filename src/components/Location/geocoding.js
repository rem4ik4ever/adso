export const getLatLngFromAddress = address => {
  return new Promise((resolve, _reject) => {
    if (!address || address.trim() == "") resolve("");
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var latitude = results[0].geometry.location.lat();
        var longitude = results[0].geometry.location.lng();
        resolve({
          latitude,
          longitude
        });
      } else {
        resolve({ latitude: null, longitude: null });
      }
    });
  });
};

export const getAddressFromLatLng = (lat, lng) => {
  return new Promise((resolve, _reject) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      {
        location: {
          lat,
          lng
        }
      },
      (result, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          resolve(result);
        } else {
          resolve("");
        }
      }
    );
  });
};
