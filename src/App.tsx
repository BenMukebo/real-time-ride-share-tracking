import "./App.css";

import AppNavBar from "./components/AppNavBar";
import AppFooterBar from "./components/AppFooterBar";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer } from "@react-google-maps/api";
import { useEffect, useState } from "react";

const center = { lat: -1.939826787816454, lng: 30.0445426438232 }; // Starting Point: Nyabugogo

const stops = [
  { location: { lat: -1.9355377074007851, lng: 30.060163829002217 }, label: "Stop A" },
  { location: { lat: -1.9358808342336546, lng: 30.08024820994666 }, label: "Stop B" },
  { location: { lat: -1.9489196023037583, lng: 30.092607828989397 }, label: "Stop C" },
  { location: { lat: -1.9592132952818164, lng: 30.106684061788073 }, label: "Stop D" },
  { location: { lat: -1.9487480402200394, lng: 30.126596781356923 }, label: "Stop E" },
  { location: { lat: -1.9365670876910166, lng: 30.13020167024439 }, label: "Kimironko" }, // Ending Point
];

function App() {
  const { isLoaded } = useJsApiLoader({
    // process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // const [directionSResponse, setDirectionSResponse] = useState(null);


  const [directions, setDirections] = useState(null);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);

  useEffect(() => {
    if (isLoaded) {
      const directionsService = new window.google.maps.DirectionsService();
      const origin = new window.google.maps.LatLng(center.lat, center.lng);
      const destination = new window.google.maps.LatLng(stops[stops.length - 1].location.lat, stops[stops.length - 1].location.lng);
      const waypoints = stops.slice(1, stops.length - 1).map(stop => ({
        location: new window.google.maps.LatLng(stop.location.lat, stop.location.lng),
        stopover: true,
      }));

      directionsService.route(
        {
          origin,
          destination,
          waypoints,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`Error fetching directions: ${status}`);
          }
        }
      );
    }
  }, [isLoaded]); // Fetch directions when the Google Maps API is loaded

  const handleNextStop = () => {
    setCurrentStopIndex(prevIndex => prevIndex + 1);
  };

  return (
    <>
      <AppNavBar />

      <Box className="details-section">
        <Typography variant="h5" component="h5" gutterBottom>
          {"Nyabugogo"} - {"Kimironko"}
        </Typography>

        <Typography variant="body1" component="p">
          Next stop: {stops[currentStopIndex].label}
        </Typography>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body1" component="p">
            Distance to next stop: {directions?.routes[0]?.legs[currentStopIndex]?.distance.text} 
          </Typography>
          <Typography variant="body1" component="p">
            Time: {directions?.routes[0]?.legs[currentStopIndex]?.duration.text}
          </Typography>
        </Stack>
      </Box>

      {!isLoaded ? (
        <Box className="loading-spiner">
          <CircularProgress size={70} />
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1 }} className="map-container">
          <GoogleMap
            center={center}
            zoom={15}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            options={{
              // disableDefaultUI: true,
              zoomControl: false,
              mapTypeControl: false,
              // streetViewControl: false,
              // fullscreenControl: false,
            }}
          >
            {/* <Marker position={center} /> */}
            {/* <DirectionsRenderer
              options={{
                directions: directionSResponse,
              }}
            /> */}
            {directions && <DirectionsRenderer directions={directions} />}
            {stops.map((stop, index) => (
              <Marker key={index} position={stop.location} label={stop.label} />
            ))}

          </GoogleMap>
          <button onClick={handleNextStop}>Next Stop</button>
          {currentStopIndex < stops.length - 1 && (
            <p>ETA to {stops[currentStopIndex + 1].label}: {directions?.routes[0]?.legs[currentStopIndex]?.duration.text}</p>
          )}
        </Box>
      )}

      <AppFooterBar />
    </>
  );
}

export default App;
