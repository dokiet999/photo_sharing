import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import models from "../../modelData/models";

/**
 * TopBar component that displays:
 * - Left side: Your name
 * - Right side: Context of current view
 */
function TopBar() {
    const location = useLocation();
    const path = location.pathname;
    
    // Your name on the left side
    const yourName = "Kiet Do"; // ← Replace with your actual name
    
    // Determine context text based on current route
    let contextText = "Welcome to PhotoShare";
    
    // Extract userId from URL if present
    const userIdMatch = path.match(/\/(users|photos)\/([^/]+)/);
    if (userIdMatch) {
        const userId = userIdMatch[2];
        const user = models.userModel(userId);
        
        if (path.includes('/photos/')) {
            contextText = `Photos of ${user.first_name} ${user.last_name}`;
        } else if (path.includes('/users/')) {
            contextText = `${user.first_name} ${user.last_name}`;
        }
    } else if (path === '/users') {
        contextText = "All Users";
    }

    return (
        <AppBar position="static" sx={{ mb: 4 }}>
            <Toolbar>
                {/* Left side - Your name */}
                <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{ flexGrow: 1 }}
                >
                    {yourName}'s Photo App
                </Typography>
                
                {/* Right side - Context */}
                <Typography variant="subtitle1">
                    {contextText}
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default TopBar;