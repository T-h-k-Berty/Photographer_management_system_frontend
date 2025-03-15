import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  InputBase,
  Avatar,
  Grid,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "bootstrap/dist/css/bootstrap.min.css";

const TopBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  // Fetch user from localStorage on page load
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/login"); // Redirect to login if no user is found
    }
  }, [navigate]);

  // Handle scrolling for animation effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCloseDrawer = () => {
    setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login"); // Redirect to login after logout
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const drawer = (
    <Box sx={{ width: 250, backgroundColor: "#444", height: "100%" }}>
      <List>
        <ListItem button onClick={handleCloseDrawer}>
          <ListItemText primary={<Typography sx={{ color: "white" }}>Booking</Typography>} />
        </ListItem>
        <ListItem button onClick={handleCloseDrawer}>
          <ListItemText primary={<Typography sx={{ color: "white" }}>Portfolio</Typography>} />
        </ListItem>
        <ListItem button onClick={handleCloseDrawer}>
          <ListItemText primary={<Typography sx={{ color: "white" }}>Schedule</Typography>} />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemText primary={<Typography sx={{ color: "red" }}>Logout</Typography>} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: scrolled ? "#222" : "#333",
        boxShadow: scrolled ? "0 4px 10px rgba(0, 0, 0, 0.3)" : "none",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo and Menu Icon for Mobile */}
        <Box display="flex" alignItems="center">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ display: { xs: "block", md: "none" }, mr: 1 }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <CameraAltIcon sx={{ fontSize: 40, color: "white", mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>
            EventClick
          </Typography>
        </Box>

        {/* Search Bar - Hidden in Mobile */}
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            backgroundColor: "#555",
            borderRadius: "30px",
            px: 2,
            py: 0.5,
            color: "white",
          }}
        >
          <InputBase
            placeholder="Search photographers..."
            inputProps={{ "aria-label": "search" }}
            sx={{ color: "white" }}
          />
        </Box>

        {/* Navigation Links and User Info */}
        <Grid container spacing={2} alignItems="center" sx={{ width: "auto", display: { xs: "none", md: "flex" } }}>
          <Grid item>
            <Typography variant="body1" sx={{ color: "white", fontWeight: "bold" }}>
              Booking
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1" sx={{ color: "white", fontWeight: "bold" }}>
              Portfolio
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1" sx={{ color: "white", fontWeight: "bold" }}>
              Schedule
            </Typography>
          </Grid>

          {/* User Profile & Welcome Message */}
          {user && (
            <Grid item>
              <Box display="flex" alignItems="center">
                <Typography
                  variant="body1"
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    mr: 1,
                    fontSize: "1.1rem",
                    textTransform: "capitalize",
                  }}
                >
                  Welcome, {user.name}
                </Typography>
                <Avatar
                  alt="Profile"
                  src={user.profilePicture ? `http://localhost:5000/${user.profilePicture}` : "https://via.placeholder.com/40"}
                  sx={{ width: 50, height: 50, border: "2px solid white", cursor: "pointer" }}
                  onClick={handleProfileClick}
                />
                <IconButton sx={{ color: "white" }} onClick={handleProfileClick}>
                  <ExpandMoreIcon />
                </IconButton>
                {/* Dropdown Menu for Profile Actions */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileClose}
                  sx={{ mt: 1 }}
                >
                  <MenuItem onClick={handleProfileClose}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            </Grid>
          )}
        </Grid>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle} sx={{ display: { xs: "block", md: "none" } }}>
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default TopBar;
