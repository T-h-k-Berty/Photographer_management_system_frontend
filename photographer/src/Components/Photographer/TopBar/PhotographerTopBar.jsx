import React, { useState, useEffect, useCallback } from "react";
import {
  AppBar, Toolbar, Typography, Box, Avatar, Grid, IconButton, Menu,
  MenuItem, Divider, Badge, Dialog, DialogTitle, DialogContent, Button, Tooltip, CircularProgress
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ---- Notification Booking Details Dialog ----
const NotificationDialog = ({
  open, booking, onClose, onAction, actionLoading, notifMessage
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle
      sx={{ background: "#181818", color: "#FFD600", fontWeight: 700, fontSize: 24, letterSpacing: 1 }}
    >
      Booking Details
    </DialogTitle>
    <DialogContent sx={{ background: "#222", pb: 3 }}>
      {!booking ? (
        <Box sx={{ textAlign: "center", p: 3 }}>
          <CircularProgress size={40} sx={{ color: "#FFD600" }} />
        </Box>
      ) : (
        <>
          <Typography sx={{ color: "#FFD600", fontWeight: 600, fontSize: 17, mb: 1 }}>
            <EventAvailableIcon sx={{ fontSize: 19, mr: 1 }} />
            {booking.eventType}
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
          {notifMessage && (
            <Typography sx={{ color: "#FFD600", mb: 2 }}>
              <b>Message:</b> {notifMessage}
            </Typography>
          )}
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              disabled={actionLoading}
              onClick={() => onAction("accept")}
            >
              Accept
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<CancelIcon />}
              disabled={actionLoading}
              onClick={() => onAction("cancel")}
            >
              Cancel
            </Button>
          </Box>
        </>
      )}
    </DialogContent>
  </Dialog>
);

// ---- Photographer Top Bar ----
const PhotographerTopBar = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifError, setNotifError] = useState(null);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [hasPortfolio, setHasPortfolio] = useState(false);

  const navigate = useNavigate();

  // Fetch portfolio status
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const res = await axios.get(
          `http://localhost:5000/api/portfolios/user/${storedUser.id}`
        );
        setHasPortfolio(!!res.data);
      } catch {
        setHasPortfolio(false);
      }
    };
    fetchPortfolio();
  }, []);

  // Fetch notifications for this user (photographer)
  const fetchNotifications = useCallback(async () => {
    setNotifLoading(true);
    setNotifError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/notifications", {
        headers: { Authorization: token },
      });
      setNotifications(
        (res.data || []).filter((n) => !n.isRead && n.type === "booking")
      );
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

  // Menu handlers
  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleNotifClick = (event) => setNotifAnchorEl(event.currentTarget);
  const handleNotifClose = () => setNotifAnchorEl(null);

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  const handleEditProfile = () => {
    handleClose();
    navigate("/edit-profile");
  };
  const handlePortfolioClick = () => {
    if (hasPortfolio) {
      navigate("/photographer/view-portfolio");
    } else {
      navigate("/photographer/create-portfolio");
    }
  };
  const handleScheduleClick = () => {
    navigate("/photographer/UpcomingEventSchedule");
  };

  // When a notification is clicked: fetch booking details and open dialog
  const handleNotifSelect = async (notif) => {
    setSelectedNotif(notif);
    setNotifAnchorEl(null);
    setBookingDetails(null);
    setDialogOpen(true);
    try {
      const token = localStorage.getItem("token");
      const { bookingId } = notif;
      if (!bookingId) {
        setBookingDetails(null);
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
  };

  // Mark notification as read after closing dialog or after an action
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

  // Accept or cancel the booking
  const handleBookingAction = async (action) => {
    if (!bookingDetails) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url =
        action === "accept"
          ? `http://localhost:5000/api/bookings/accept/${bookingDetails.id}`
          : `http://localhost:5000/api/bookings/cancel/${bookingDetails.id}`;
      await axios.put(url, {}, { headers: { Authorization: token } });
      setDialogOpen(false);
      if (selectedNotif) {
        await markNotifAsRead(selectedNotif.id);
      }
      setSelectedNotif(null);
      setBookingDetails(null);
      fetchNotifications(); // Refresh notification list
    } catch (e) {
      alert("Failed to update booking status.");
    }
    setActionLoading(false);
  };

  // When dialog closes (no action), mark notification as read
  const handleDialogClose = async () => {
    setDialogOpen(false);
    if (selectedNotif) {
      await markNotifAsRead(selectedNotif.id);
      setSelectedNotif(null);
    }
    setBookingDetails(null);
  };

  // Show notification icon with badge
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
          {/* Logo + Title */}
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

          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="flex-end"
            sx={{ width: "auto" }}
          >
            <Grid item>
              <Typography variant="body1" sx={{ color: "white", fontWeight: "bold" }}>
                Booking
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="body1"
                sx={{ color: "white", fontWeight: "bold", cursor: "pointer" }}
                onClick={handlePortfolioClick}
              >
                {hasPortfolio ? "View Portfolio" : "Create Portfolio"}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="body1"
                sx={{ color: "white", fontWeight: "bold", cursor: "pointer" }}
                onClick={handleScheduleClick}
              >
                Schedule
              </Typography>
            </Grid>
            {/* Notification Icon */}
            <Grid item>
              <Tooltip title="Booking Notifications" arrow>
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
                    Booking Notifications
                  </Typography>
                  <Divider sx={{ mb: 1 }} />
                  {notifLoading ? (
                    <Box sx={{ textAlign: "center", my: 4 }}>
                      <CircularProgress size={30} sx={{ color: "#FFD600" }} />
                    </Box>
                  ) : notifications.length === 0 ? (
                    <Typography sx={{ color: "#666", textAlign: "center", mt: 2 }}>
                      No new booking notifications.
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
            {/* Profile Dropdown */}
            <Grid item>
              <Box display="flex" alignItems="center">
                <Avatar
                  src={
                    user.profilePicture
                      ? `http://localhost:5000/${user.profilePicture}`
                      : "https://via.placeholder.com/40"
                  }
                  onClick={handleProfileClick}
                  sx={{
                    width: 45,
                    height: 45,
                    cursor: "pointer",
                    border: "2px solid white",
                  }}
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
                      boxShadow: "0px 4px 20px rgba(0,0,0,0.3)",
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{ color: "#333" }}
                    >
                      👤 {user.name}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={handleEditProfile}>✏️ Edit Profile</MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
                    🚪 Logout
                  </MenuItem>
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
        onClose={handleDialogClose}
        onAction={handleBookingAction}
        actionLoading={actionLoading}
        notifMessage={selectedNotif?.message}
      />
    </>
  );
};

export default PhotographerTopBar;
