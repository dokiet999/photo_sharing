import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

function TopBar({ user, handleLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const [users, setUsers] = useState([]);
  const [contextText, setContextText] = useState("Welcome to PhotoShare");

  // Only fetch user list if logged in
  useEffect(() => {
    if (!user) return;
    fetch("http://localhost:8081/lists", { credentials: "include" })
      .then((res) => {
        if (res.status === 401) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => console.error("Failed to load user list:", err));
  }, [user]);

  // Update contextText based on route
  useEffect(() => {
    if (!user) {
      setContextText("Please Login");
      return;
    }

    const userIdMatch = path.match(/\/(users|photos)\/([^/]+)/);
    if (userIdMatch) {
      const userId = userIdMatch[2];
      const userObj = users.find((u) => u._id === userId);

      if (userObj) {
        if (path.includes("/photos/")) {
          setContextText(`Photos of ${userObj.first_name} ${userObj.last_name}`);
        } else if (path.includes("/users/")) {
          setContextText(`${userObj.first_name} ${userObj.last_name}`);
        }
      } else {
        setContextText("Loading user...");
      }
    } else if (path === "/users") {
      setContextText("All Users");
    } else {
      setContextText("Welcome to PhotoShare");
    }
  }, [path, users, user]);

  const onLoginClick = () => navigate("/login");
  const onLogoutClick = () => {
    handleLogout?.();
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Photo Sharing
        </Typography>

        <Typography variant="subtitle1" sx={{ mr: 2 }}>
          {contextText}
        </Typography>

        <Box>
          {user ? (
            <>
              <Typography variant="body2" sx={{ mr: 2 }}>
                Hi {user.first_name}
              </Typography>
              <Button color="inherit" onClick={onLogoutClick}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={onLoginClick}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
