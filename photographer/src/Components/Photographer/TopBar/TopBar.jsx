import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import "bootstrap/dist/css/bootstrap.min.css";

const TopBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scrolling to add animation
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

  const drawer = (
    <Box
      sx={{
        width: 250,
        backgroundColor: "#444",
        height: "100%",
        transition: "all 0.3s ease-in-out",
        opacity: mobileOpen ? 1 : 0,
      }}
    >
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
      </List>
    </Box>
  );

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: scrolled ? "#333" : "#444",
        boxShadow: scrolled ? "0 4px 10px rgba(0, 0, 0, 0.3)" : "none",
        transition: "all 0.3s ease-in-out",
        transform: scrolled ? "scale(0.98)" : "scale(1)",
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

        {/* Navigation Links and Profile - Hidden in Mobile */}
        <Grid
          container
          spacing={2}
          alignItems="center"
          sx={{ width: "auto", display: { xs: "none", md: "flex" } }}
        >
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
          <Grid item>
            <Avatar
              alt="Profile"
              src="https://via.placeholder.com/40"
              sx={{ width: 40, height: 40 }}
            />
          </Grid>
        </Grid>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default TopBar;
