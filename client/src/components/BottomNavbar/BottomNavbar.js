import React,{useContext} from 'react'
import {UserContext} from '../../App'
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Paper from '@mui/material/Paper';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';



function BottomNavbar() {
  const [value, setValue] = React.useState(0);
  const {state,dispatch} = useContext(UserContext)
 
  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        { state ? <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <Link to={'/'}>
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          </Link>
          <Link to={'/createpost'}>
          <BottomNavigationAction label="Favorites" icon={<AddCircleIcon />} />
          </Link>
          <Link to={'/profile'}>
          <BottomNavigationAction label="Archive" icon={<AccountCircleIcon />} />
          </Link>
        </BottomNavigation>
      :  
      ' '
      }
      </Paper>
  )
}

export default BottomNavbar