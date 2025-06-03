import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Avatar,
  Divider,
  Chip,
  Stack,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import models from "../../modelData/models";
import "./styles.css";

/**
 * UserDetail component displaying comprehensive user information
 */
function UserDetail() {
  const { userId: paramId } = useParams(); // Lấy userId từ URL nếu có
  const [userId, setUserId] = useState(paramId || null);
  const [user, setUser] = useState(null);

  useEffect(() => {
  const fetchUser = async () => {
    try {
      if (paramId) {
        const response = await fetch(`http://localhost:8081/user/${paramId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user by ID");
        }
        const data = await response.json();
        setUser(data);
      } else {
        const response = await fetch("http://localhost:8081/lists");
        if (!response.ok) {
          throw new Error("Failed to fetch user list");
        }
        const data = await response.json();
        if (data.length > 0) {
          setUserId(data[0]._id);
          setUser(data[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  fetchUser();
}, [paramId]);


  if (!user) {
    return <Typography>Loading user data...</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
        }}
      >
        {/* User Avatar Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              width: 120,
              height: 120,
              fontSize: "2.5rem",
              bgcolor: "primary.main",
              mb: 2,
            }}
          >
            {user.first_name.charAt(0)}
            {user.last_name.charAt(0)}
          </Avatar>
          <Typography variant="h5" component="h1" sx={{ textAlign: "center" }}>
            {user.first_name} {user.last_name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
            {user.occupation}
          </Typography>
        </Box>

        {/* User Details Section */}
        <Box sx={{ flexGrow: 1 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            <Chip
              label={`📍 ${user.location}`}
              color="primary"
              variant="outlined"
            />
            <Chip label={`👤 Member since 2023`} variant="outlined" />
          </Stack>

          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            {user.description || "No description available."}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to={`/photos/${user._id}`}
              sx={{ px: 4 }}
            >
              View Photos
            </Button>
            <Button variant="outlined" component={Link} to="/users">
              Back to Users
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

export default UserDetail;