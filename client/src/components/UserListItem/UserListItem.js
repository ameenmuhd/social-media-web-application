import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";

function UserListItem({ user, handleFunction }) {
  return (
    <List
      dense
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
    >
      <ListItem disablePadding>
        <ListItemButton onClick={handleFunction}>
          <ListItemAvatar>
            <Avatar
              alt={"no"}
              src={user.pic}
            />
          </ListItemAvatar>
          <ListItemText primary={user.name} />
        </ListItemButton>
      </ListItem>
    </List>
  );
}

export default UserListItem;
