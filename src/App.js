import React, { useState } from "react";
import { Grid, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import Test from './Test';
import Register from "./components/Register";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [advancedFeaturesEnabled, setAdvancedFeaturesEnabled] = useState(false);

  const handleLogin = (user) => {
    setLoggedInUser(user);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  return (
    <Router>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TopBar user={loggedInUser} handleLogout={handleLogout}  advancedFeaturesEnabled={advancedFeaturesEnabled} setAdvancedFeaturesEnabled={setAdvancedFeaturesEnabled}/>
        </Grid>
        <div className="main-topbar-buffer" />
        <Grid item sm={3}>
          <Paper className="main-grid-item">
            {loggedInUser ? <UserList /> : null}
          </Paper>
        </Grid>
        <Grid item sm={9}>
          <Paper className="main-grid-item">
            <Routes>
              {/* Route login và register không cần bảo vệ */}
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/register" element={<Register />} />

              {/* Các route được bảo vệ */}
              <Route
                path="/users"
                element={
                  <ProtectedRoute user={loggedInUser}>
                    <UserList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users/:userId"
                element={
                  <ProtectedRoute user={loggedInUser}>
                    <UserDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/photos/:userId/:photoIndex?"
                element={
                  <ProtectedRoute user={loggedInUser}>
                    <UserPhotos currentUser={loggedInUser}  advancedFeaturesEnabled={advancedFeaturesEnabled}/>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/test"
                element={
                  <ProtectedRoute user={loggedInUser}>
                    <Test />
                  </ProtectedRoute>
                }
              />

              {/* Redirect về login nếu không match route */}
              <Route path="*" element={<Navigate to={loggedInUser ? "/users" : "/login"} replace />} />
            </Routes>
          </Paper>
        </Grid>
      </Grid>
    </Router>
  );
};

export default App;
