import GoogleMapReact from "google-map-react";

export default function MapView() {
  const defaultProps = {
    center: {
      lat: 37.48010072,
      lng: -122.1674036,
    },
    zoom: 15,
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyCIpZqrYTmqR0pMG9vHXeEx_YK7QIdsXO8" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      ></GoogleMapReact>
    </div>
  );
}
