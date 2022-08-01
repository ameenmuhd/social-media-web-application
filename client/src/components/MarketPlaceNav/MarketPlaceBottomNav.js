import React,{useContext} from 'react'
import {UserContext} from '../../App'
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './MarketPlaceBottomNav.css'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
import { Tooltip } from '@mui/material';


function MarketPlaceBottomNav() {
  const [value, setValue] = React.useState(0);
  const {state,dispatch} = useContext(UserContext)

 
  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0}}   elevation={3}>
        { state ? <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          
        >
          <Link to={'/'}>
          <Tooltip title="Home" arrow>
          <BottomNavigationAction label="Home" icon={<HomeIcon/>} />
          </Tooltip>
          </Link>
          <Link to={`/chat/${state._id}`}>
          <Tooltip title="chat" arrow>
          <BottomNavigationAction label="Favorites" icon={<MapsUgcIcon/>} />
          </Tooltip>
          </Link>
          <Link to={`/myads/${state._id}`}>
          <Tooltip title="My Ads" arrow>
          <BottomNavigationAction label="Favorites" icon={<FavoriteBorderIcon/>} />
          </Tooltip>
          </Link>
          <Link to={'/profile'}>
          <Tooltip title="My Profile" arrow>
          <BottomNavigationAction label="Archive" icon={<AccountCircleIcon/>} />
          </Tooltip>
          </Link>
        </BottomNavigation>
      :  
      ' '
      }
      </Paper>
  )
}

export default MarketPlaceBottomNav