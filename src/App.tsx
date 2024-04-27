import "./App.css";

import { useJsApiLoader, GoogleMap } from "@react-google-maps/api";
import AppNavBar from "./components/AppNavBar";
import AppFooterBar from "./components/AppFooterBar";
import { Box, CircularProgress } from "@mui/material";

const center = { lat: 51.1657, lng: 10.4515 };

function App() {
  const { isLoaded } = useJsApiLoader({
    // process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  return (
    <>
      <AppNavBar />

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
          />
        </Box>
      )}

      <AppFooterBar />
    </>
  );
}

export default App;
