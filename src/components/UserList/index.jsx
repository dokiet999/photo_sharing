import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";
import models from "../../modelData/models";

/**
 * UserList component that provides navigation to all user details
 */
function UserList() {
  const users = models.userListModel();

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Typography
        variant="subtitle1"
        component="h2"
        sx={{
          px: 2,
          py: 1.5,
          fontWeight: "bold",
          color: "text.secondary",
        }}
      >
        ALL USERS
      </Typography>
      <Divider />
      <List component="nav" sx={{ width: "100%" }}>
        {users.map((user) => (
          <React.Fragment key={user._id}>
            <ListItem
              sx={{
                px: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <Box
                component={Link}
                to={`/users/${user._id}`}
                sx={{ textDecoration: "none", color: "inherit", flexGrow: 1 }}
              >
                <ListItemText
                  primary={`${user.first_name} ${user.last_name}`}
                  primaryTypographyProps={{
                    variant: "body1",
                    sx: { fontWeight: "medium" },
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Chip
                  label={user.numPhotos}
                  size="small"
                  sx={{ backgroundColor: "green", color: "white" }}
                />
                <Chip
                  label={user.numComments}
                  size="small"
                  component={Link}
                  to={`/users/${user._id}/comments`}
                  clickable
                  sx={{ backgroundColor: "red", color: "white" }}
                />
              </Box>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

export default UserList;
