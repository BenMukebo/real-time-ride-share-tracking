import "./App.css";

import { useEffect, useState } from "react";
import AppNavBar from "./components/AppNavBar";
import AppFooterBar from "./components/AppFooterBar";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

const center = { lat: -1.939826787816454, lng: 30.0445426438232 }; // Starting Point: Nyabugogo
const intermediateStops = [
  { location: { lat: -1.9355377074007851, lng: 30.060163829002217 }, label: "Stop A" },
  { location: { lat: -1.9358808342336546, lng: 30.08024820994666 }, label: "Stop B" },
  { location: { lat: -1.9489196023037583, lng: 30.092607828989397 }, label: "Stop C" },
  { location: { lat: -1.9592132952818164, lng: 30.106684061788073 }, label: "Stop D" },
  { location: { lat: -1.9487480402200394, lng: 30.126596781356923 }, label: "Stop E" },
];
const endingPoint = { location: { lat: -1.9365670876910166, lng: 30.13020167024439 }, label: "Kimironko" };


// const stops = [center, ...intermediateStops.map(stop => stop.location), endingPoint];
type StopSchema = { location: { lat: number; lng: number }; label: string };
const stops: StopSchema[] = [
  { location: center, label: "Nyabugogo" },
  ...intermediateStops,
  endingPoint,
];


function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // process.env.
    libraries: ["places"],
  });

  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [directions, setDirections] = useState(null);
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
    }, (results, status ) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        setDirections(results);
      } else {
        console.error(`Error fetching directions: ${status}`);
      }
    });
  }

  useEffect(() => {
    if (isLoaded) {
      calculateRoute();
    }
  }, [isLoaded]); // Recalculate route when the map is loaded

  const calculateNextStopETA = () => {
    const directionsService = new window.google.maps.DirectionsService();
    const origin = new window.google.maps.LatLng(stops[currentStopIndex].location.lat, stops[currentStopIndex].location.lng);
    const destination = new window.google.maps.LatLng(stops[currentStopIndex + 1].location.lat, stops[currentStopIndex + 1].location.lng);
    // const currentPoints = new window.google.maps.LatLng(stops[currentStopIndex].location.lat, stops[currentStopIndex].location.lng); 

    directionsService.route({
      origin,
      destination,
      // waypoints,
      optimizeWaypoints: true,
      travelMode: window.google.maps.TravelMode.DRIVING,
    }, (results, status ) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        setDistance(results?.routes[0]?.legs[0]?.distance?.text || '');
        setTime(results?.routes[0]?.legs[0]?.duration?.text || '');

      // Automatically move to the next stop after the estimated time
      // const durationInSeconds = results?.routes[0]?.legs[0]?.duration?.value || 0;
    } else {
      console.error(`Error fetching directions: ${status}`);
    }
    });
  };

  useEffect(() => {
    
    const interval = setInterval(() => {
      if (currentStopIndex < stops.length - 1) {
        setCurrentStopIndex((prevIndex) => prevIndex + 1);
      } else {
        clearInterval(interval); // Clear interval when all stops are visited
        setCurrentStopIndex(0);
      }
    }, 7000);

    calculateNextStopETA(); // Recalculate ETA for the next stop

    return () => {
      clearInterval(interval);
    };
  }, [currentStopIndex]); // Trigger stop change effect



  // const calculateETANextStop = () => {
  //   const distanceToNextStop =
  //     directions?.routes[0]?.legs[currentStopIndex]?.distance?.text || "";
  //   const timeToNextStop =
  //     directions?.routes[0]?.legs[currentStopIndex]?.duration?.text || "";

  //   return { distance: distanceToNextStop, time: timeToNextStop };
  // };

  // const { distance, time } = calculateETANextStop();

  return (
    <>
      <AppNavBar />

      <Box className="details-section">
        <Typography variant="h5" component="h5" gutterBottom>
          Nyabugogo - Kimironko
        </Typography>

        <Typography variant="body1" component="p">
          Next stop: {stops[currentStopIndex + 1].label}
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
              // disableDefaultUI: true,
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
