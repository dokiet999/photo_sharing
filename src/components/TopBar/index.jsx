import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

function TopBar({ user, handleLogout, advancedFeaturesEnabled, setAdvancedFeaturesEnabled }) {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const [users, setUsers] = useState([]);
  const [contextText, setContextText] = useState("Welcome to PhotoShare");

  useEffect(() => {
    if (!user) return;
    fetch("http://localhost:8081/lists", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => console.error("User fetch error:", err));
  }, [user]);

  useEffect(() => {
    if (!user) {
      setContextText("Please login");
      return;
    }

    if (path === "/users") {
      setContextText("All Users");
      return;
    }

    const match = path.match(/\/(users|photos)\/([^/]+)/);
    if (match) {
      const [, section, userId] = match;
      const matchedUser = users.find((u) => u._id === userId);

      if (matchedUser) {
        setContextText(
          section === "photos"
            ? `Photos of ${matchedUser.first_name} ${matchedUser.last_name}`
            : `${matchedUser.first_name} ${matchedUser.last_name}`
        );
      } else {
        setContextText("Loading user...");
      }
    } else {
      setContextText("Welcome to PhotoShare");
    }
  }, [path, users, user]);

  const handleLoginClick = () => navigate("/login");
  const handleLogoutClick = () => {
    handleLogout?.();
    navigate("/login");
  };

  const handleToggleAdvancedFeatures = (event) => {
    setAdvancedFeaturesEnabled(event.target.checked);
  };

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          PhotoShare
        </Typography>

        <Typography variant="subtitle1" sx={{ mr: 2 }}>
          {contextText}
        </Typography>

        {user && (
          <FormControlLabel
            control={
              <Checkbox
                checked={advancedFeaturesEnabled}
                onChange={handleToggleAdvancedFeatures}
                color="default"
              />
            }
            label="Enable Advanced Features"
            sx={{ mr: 2 }}
          />
        )}

        {user ? (
          <Box display="flex" alignItems="center">
            <Typography variant="body2" sx={{ mr: 2 }}>
              Hi {user.first_name || user.login_name}
            </Typography>
            <Button color="inherit" onClick={handleLogoutClick}>
              Logout
            </Button>
          </Box>
        ) : (
          <Button color="inherit" onClick={handleLoginClick}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
