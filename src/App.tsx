import { useEffect, useState } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import AppNavBar from "./components/AppNavBar";
import AppFooterBar from "./components/AppFooterBar";
import { center, endingPoint, intermediateStops, stops } from "./constants";
import "./App.css";


function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // process.env.
    libraries: ['places', 'geometry', 'drawing', 'visualization'],
  });

  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');

  const calculateRoute = () => {
    const directionsService = new window.google.maps.DirectionsService();
    const origin = new window.google.maps.LatLng(center.lat, center.lng);
    const destination = new window.google.maps.LatLng(endingPoint.location.lat, endingPoint.location.lng);
    const waypoints = intermediateStops.map((stop) => ({
      location: new window.google.maps.LatLng(stop.location.lat, stop.location.lng),
      stopover: true,
    }));

    directionsService.route({
      origin,
      destination,
      waypoints,
      optimizeWaypoints: true,
      travelMode: window.google.maps.TravelMode.DRIVING,
    }, (results, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        setDirections(results);
      } else {
        console.error(`Error fetching directions: ${status}`);
      }
    });
  }

  const calculateNextStopETA = () => {
    const directionsService = new window.google.maps.DirectionsService();
    const origin = new window.google.maps.LatLng(stops[currentStopIndex].location.lat, stops[currentStopIndex].location.lng);
    const destination = new window.google.maps.LatLng(stops[currentStopIndex + 1].location.lat, stops[currentStopIndex + 1].location.lng);

    directionsService.route({
      origin,
      destination,
      optimizeWaypoints: true,
      travelMode: window.google.maps.TravelMode.DRIVING,
    }, (results, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        setDistance(results?.routes[0]?.legs[0]?.distance?.text || '');
        setTime(results?.routes[0]?.legs[0]?.duration?.text || '');
      } else {
        console.error(`Error fetching directions: ${status}`);
      }
    });
  };


  useEffect(() => {
    if (isLoaded) {
      calculateRoute();
      calculateNextStopETA();
    }
  }, [isLoaded]); // Recalculate route when the map is loaded

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentStopIndex < stops.length - 1) {
        calculateNextStopETA(); // Recalculate ETA for the next stop
        setCurrentStopIndex((prevIndex) => prevIndex + 1);
      } else {
        clearInterval(interval); // Clear interval when all stops are visited
        setCurrentStopIndex(0);
      }
    }, 7000);

    return () => {
      clearInterval(interval);
    };
  }, [currentStopIndex]); // Trigger stop change effect

  return (
    <>
      <AppNavBar />

      <Box className="details-section">
        <Typography variant="h5" component="h5" gutterBottom>
          Nyabugogo - Kimironko
        </Typography>
        <Typography variant="body1" component="p">
          Next stop: {currentStopIndex < stops.length - 1 ? stops[currentStopIndex + 1]?.label : "End"}
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body1" component="p">
            Distance to next stop: {distance}
          </Typography>
          <Typography variant="body1" component="p">
            Time to next stop: {time}
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
              zoomControl: false,
              mapTypeControl: false,
              // streetViewControl: false,
              // fullscreenControl: false,
            }}
          >
            {directions && <DirectionsRenderer directions={directions} />}

            {stops.map((stop, index) => (
              <Marker key={index} position={stop.location} label={stop.label} />
            ))}

            {currentStopIndex < stops.length && (
              <Marker
                position={stops[currentStopIndex].location}
                icon={{
                  url: "https://maps.google.com/mapfiles/kml/shapes/bus.png",
                  scaledSize: new window.google.maps.Size(40, 40),
                  strokeColor: "white",
                }}
              />
            )}
          </GoogleMap>
        </Box>
      )}

      <AppFooterBar />
    </>
  );
}

export default App;
