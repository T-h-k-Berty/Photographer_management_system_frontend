import React, { useState } from "react";
import {
  AppBar, Toolbar, Typography, Box, Avatar, Grid,
  IconButton, Menu, MenuItem, Divider
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";

const ClientTopBar = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleEditProfile = () => {
    handleClose();
    navigate("/edit-profile");
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#222" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center">
          <CameraAltIcon sx={{ fontSize: 35, color: "white", mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>
            EventClick
          </Typography>
        </Box>

        <Grid container spacing={2} alignItems="center" justifyContent="flex-end" sx={{ width: "auto" }}>
          <Grid item>
            <Typography variant="body1" sx={{ color: "white", fontWeight: "bold" }}>Bookings</Typography>
          </Grid>
          <Grid item>
            <Box display="flex" alignItems="center">
              <Avatar
                src={user.profilePicture ? `http://localhost:5000/${user.profilePicture}` : "https://via.placeholder.com/40"}
                onClick={handleProfileClick}
                sx={{ width: 45, height: 45, cursor: "pointer", border: "2px solid white" }}
              />
              <IconButton onClick={handleProfileClick} sx={{ color: "white" }}>
                <ExpandMoreIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 200,
                    borderRadius: 2,
                    boxShadow: "0px 4px 20px rgba(0,0,0,0.3)"
                  }
                }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#333" }}>
                    👤 {user.name}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleEditProfile}>✏️ Edit Profile</MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: "red" }}>🚪 Logout</MenuItem>
              </Menu>
            </Box>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default ClientTopBar;
