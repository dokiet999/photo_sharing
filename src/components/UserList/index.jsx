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
import { useState,useEffect } from "react";
import { use } from "react";

/**
 * UserList component that provides navigation to all user details
 */
function UserList() {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8081/lists")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        return response.json();
      })
      .then((data) => setUsers(data))
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

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

      {users ? (
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
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    flexGrow: 1,
                  }}
                >
                  <ListItemText
                    primary={`${user.first_name} ${user.last_name}`}
                    primaryTypographyProps={{
                      variant: "body1",
                      sx: { fontWeight: "medium" },
                    }}
                  />
                </Box>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography variant="body2" sx={{ px: 2, py: 2 }}>
          Loading users...
        </Typography>
      )}
    </div>
  );
}
export default UserList;
