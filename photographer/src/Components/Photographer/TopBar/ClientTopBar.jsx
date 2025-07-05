import React, { useState, useEffect, useCallback } from "react";
import {
  AppBar, Toolbar, Typography, Box, Avatar, Grid, IconButton, Menu,
  MenuItem, Divider, Badge, Tooltip, CircularProgress, Dialog, DialogTitle, DialogContent, Button
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NotificationsIcon from "@mui/icons-material/Notifications";
import InfoIcon from "@mui/icons-material/Info";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NotificationDialog = ({
  open, booking, onClose, notifMessage, loading
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle sx={{
      background: "#181818", color: "#FFD600", fontWeight: 700, fontSize: 24, letterSpacing: 1
    }}>
      Booking Update
    </DialogTitle>
    <DialogContent sx={{ background: "#222", pb: 3 }}>
      {loading ? (
        <Box sx={{ textAlign: "center", p: 3 }}>
          <CircularProgress size={40} sx={{ color: "#FFD600" }} />
        </Box>
      ) : !booking ? (
        <Typography sx={{ color: "#e53935", my: 2 }}>Booking details not found.</Typography>
      ) : (
        <>
          <Typography sx={{ color: "#FFD600", fontWeight: 600, fontSize: 17, mb: 1 }}>
            <InfoIcon sx={{ fontSize: 18, mr: 1 }} />
            {notifMessage}
          </Typography>
          <Typography sx={{ color: "#fff", mb: 1 }}>
            <CalendarMonthIcon sx={{ color: "#FFD600", fontSize: 16, mr: 0.6 }} />
            {booking.date} &nbsp;
            <AccessTimeIcon sx={{ color: "#FFD600", fontSize: 16, mr: 0.6 }} />
            {booking.time}
          </Typography>
          <Typography sx={{ color: "#fffde7", mb: 1 }}>
            <LocationOnIcon sx={{ color: "#FFD600", fontSize: 16, mr: 1 }} />
            {booking.address}
          </Typography>
          <Typography sx={{ color: "#fffde7", mb: 2 }}>
            {booking.description || <i>No description</i>}
          </Typography>
        </>
      )}
      <Box textAlign="right" mt={2}>
        <Button onClick={onClose} color="warning" variant="contained">Close</Button>
      </Box>
    </DialogContent>
  </Dialog>
);

const ClientTopBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifError, setNotifError] = useState(null);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // --- Fetch notifications ---
  const fetchNotifications = useCallback(async () => {
    setNotifLoading(true);
    setNotifError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/notifications", {
        headers: { Authorization: token },
      });
      // Only status notifications for this user
      setNotifications((res.data || []).filter((n) => !n.isRead && n.type === "status"));
    } catch (e) {
      setNotifError("Failed to load notifications");
    }
    setNotifLoading(false);
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // --- Profile menu handlers ---
  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // --- Notification menu handlers ---
  const handleNotifClick = (event) => setNotifAnchorEl(event.currentTarget);
  const handleNotifClose = () => setNotifAnchorEl(null);

  // --- Logout, edit, view bookings ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  const handleEditProfile = () => {
    handleClose();
    navigate("/edit-profile");
  };
  const handleBookingsClick = () => {
    navigate("/Client/ViewBookings");
  };

  // --- On notification click: show booking details ---
  const handleNotifSelect = async (notif) => {
    setSelectedNotif(notif);
    setNotifAnchorEl(null);
    setBookingDetails(null);
    setDialogOpen(true);
    setDialogLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { bookingId } = notif;
      if (!bookingId) {
        setBookingDetails(null);
        setDialogLoading(false);
        return;
      }
      const res = await axios.get(
        `http://localhost:5000/api/bookings/${bookingId}`,
        { headers: { Authorization: token } }
      );
      setBookingDetails(res.data);
    } catch (e) {
      setBookingDetails(null);
    }
    setDialogLoading(false);
  };

  // --- Mark notification as read ---
  const markNotifAsRead = async (notifId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/notifications/${notifId}/read`,
        {},
        { headers: { Authorization: token } }
      );
      setNotifications((notifs) => notifs.filter((n) => n.id !== notifId));
    } catch {}
  };

  // --- When dialog closes ---
  const handleDialogClose = async () => {
    setDialogOpen(false);
    if (selectedNotif) {
      await markNotifAsRead(selectedNotif.id);
      setSelectedNotif(null);
    }
    setBookingDetails(null);
  };

  // --- Notification bell with badge ---
  const notifBadge = (
    <Badge
      color="error"
      badgeContent={notifications.length}
      invisible={notifications.length === 0}
    >
      <NotificationsIcon sx={{ color: "#FFD600", fontSize: 28 }} />
    </Badge>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "#222" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box
            display="flex"
            alignItems="center"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/PhotographerHome")}
          >
            <CameraAltIcon sx={{ fontSize: 35, color: "white", mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>
              EventClick
            </Typography>
          </Box>

          <Grid container spacing={2} alignItems="center" justifyContent="flex-end" sx={{ width: "auto" }}>
            <Grid item>
              <Typography
                variant="body1"
                sx={{ color: "white", fontWeight: "bold", cursor: "pointer" }}
                onClick={handleBookingsClick}
              >
                Bookings
              </Typography>
            </Grid>
            {/* --- Notification Icon --- */}
            <Grid item>
              <Tooltip title="Booking Status Notifications" arrow>
                <IconButton
                  sx={{ color: "#FFD600", mx: 1 }}
                  onClick={handleNotifClick}
                  size="large"
                >
                  {notifBadge}
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={notifAnchorEl}
                open={Boolean(notifAnchorEl)}
                onClose={handleNotifClose}
                PaperProps={{
                  sx: {
                    mt: 1.3,
                    minWidth: 350,
                    borderRadius: 2,
                    boxShadow: "0px 4px 20px rgba(0,0,0,0.3)",
                    maxHeight: 340,
                  },
                }}
              >
                <Box sx={{ p: 1 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 17, color: "#FFD600", mb: 1 }}>
                    Booking Status
                  </Typography>
                  <Divider sx={{ mb: 1 }} />
                  {notifLoading ? (
                    <Box sx={{ textAlign: "center", my: 4 }}>
                      <CircularProgress size={30} sx={{ color: "#FFD600" }} />
                    </Box>
                  ) : notifications.length === 0 ? (
                    <Typography sx={{ color: "#666", textAlign: "center", mt: 2 }}>
                      No new booking updates.
                    </Typography>
                  ) : (
                    notifications.map((notif) => (
                      <MenuItem
                        key={notif.id}
                        onClick={() => handleNotifSelect(notif)}
                        sx={{
                          mb: 1,
                          alignItems: "flex-start",
                          whiteSpace: "normal",
                          "&:hover": { background: "#FFFDE7" },
                        }}
                      >
                        <Box>
                          <Typography sx={{ fontWeight: 600, color: "#222", fontSize: 15 }}>
                            {notif.message}
                          </Typography>
                          <Typography sx={{ fontSize: 12, color: "#999" }}>
                            {new Date(notif.createdAt).toLocaleString()}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))
                  )}
                </Box>
              </Menu>
            </Grid>
            <Grid item>
              <Box display="flex" alignItems="center">
                <Avatar
                  src={user?.profilePicture ? `http://localhost:5000/${user.profilePicture}` : "https://via.placeholder.com/40"}
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
                      👤 {user?.name}
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
      {/* Notification Booking Details Dialog */}
      <NotificationDialog
        open={dialogOpen}
        booking={bookingDetails}
        notifMessage={selectedNotif?.message}
        onClose={handleDialogClose}
        loading={dialogLoading}
      />
    </>
  );
};

export default ClientTopBar;
