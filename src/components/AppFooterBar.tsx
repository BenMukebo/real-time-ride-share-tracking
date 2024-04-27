import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';


export default function AppFooterBar() {
  const [value, setValue] = React.useState(0);

  return (
    <Box sx={{ width: 1 }} className="app-header">
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        sx={{ bgcolor: "transparent"}}
      >
        <BottomNavigationAction label="" icon={<FavoriteBorderIcon />} />
        <BottomNavigationAction label="" icon={<AccessTimeIcon />} />
        <BottomNavigationAction label="" icon={<NotificationsNoneIcon />} />
      </BottomNavigation>
    </Box>
  );
}