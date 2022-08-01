import React from "react";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

function UserBadgeItem({ user, handleFunction }) {
  return (
    <div style={{ paddingLeft: "2px" }}>
      {/* <Button variant="contained" endIcon={<DeleteIcon onClick={handleFunction}/>} >
        {user.name}
      </Button> */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          listStyle: "none",
          p: 0.5,
          m: 0,
        }}
        component="ul"
      >
        <ListItem key={user._id}>
          <Chip label={user.name} onDelete={handleFunction} />
        </ListItem>
      </div>
    </div>
  );
}

export default UserBadgeItem;
