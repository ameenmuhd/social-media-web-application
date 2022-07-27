import React from 'react'
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

function UserBadgeItem({user,handleFunction}) {
  return (
    <div style={{paddingLeft:"2px"}}>
        <Button variant="contained" endIcon={<DeleteIcon onClick={handleFunction}/>} >
        {user.name}
      </Button>
    </div>
  )
}

export default UserBadgeItem