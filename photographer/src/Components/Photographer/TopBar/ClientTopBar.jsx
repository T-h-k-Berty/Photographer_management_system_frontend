import React, { useState, useEffect, useCallback } from "react";
import {
  AppBar, Toolbar, Typography, Box, Avatar, Grid, IconButton, Menu,
  MenuItem, Divider, Badge, Tooltip, CircularProgress, Dialog, DialogTitle, DialogContent, Button, Chip
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NotificationsIcon from "@mui/icons-material/Notifications";
import InfoIcon from "@mui/icons-material/Info";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const statusMap = {
  Accepted: {
    label: "Accepted",
    color: "#2cff6e",
    icon: <CheckCircleIcon sx={{ fontSize: 22, verticalAlign: "-5px" }} />
  },
  Cancelled: {
    label: "Cancelled",
    color: "#e53935",
    icon: <CancelIcon sx={{ fontSize: 22, verticalAlign: "-5px" }} />
  },
  Pending: {
    label: "Pending",
    color: "#FFD600",
    icon: <HourglassEmptyIcon sx={{ fontSize: 22, verticalAlign: "-5px" }} />
  }
};

const getStatusChip = (status) => {
  const s = statusMap[status] || statusMap.Pending;
  return (
    <Chip
      label={s.label}
      icon={s.icon}
      sx={{
        background: s.color,
        color: "#181818",
        fontWeight: "bold",
        fontSize: 17,
        px: 2.2,
        py: 1.5,
        borderRadius: "15px",
        boxShadow: "0 2px 10px 0 #0004",
        letterSpacing: 0.7,
        ml: 1
      }}
    />
  );
};

// --- Notification Dialog ---
const NotificationDialog = ({
  open, booking, onClose, notifMessage, loading
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="xs"
    fullWidth
    PaperProps={{
      sx: {
        background: "rgba(22,22,22,0.85)",
        borderRadius: "28px",
        boxShadow: "0 8px 40px #FFD60066, 0 1.5px 9px #000a",
        overflow: "hidden",
        border: "2.5px solid #FFD600",
        backdropFilter: "blur(10px)",
      }
    }}
  >
    <DialogTitle
      sx={{
        color: "#FFD600",
        fontWeight: 800,
        fontSize: 27,
        letterSpacing: 1.5,
        px: 3,
        py: 2.5,
        boxShadow: "0 2px 12px #FFD60033",
        borderBottom: "2px solid #FFD600",
        background: "linear-gradient(90deg, #222 80%, #FFD60022 100%)",
        position: "relative"
      }}
    >
      Booking Update
      {booking && (
        <Box sx={{ position: "absolute", right: 28, top: 22 }}>
          {getStatusChip(booking.status)}
        </Box>
      )}
    </DialogTitle>
    <DialogContent sx={{ p: { xs: 2, md: 4 } }}>
      {loading ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress size={50} sx={{ color: "#FFD600" }} />
        </Box>
      ) : !booking ? (
        <Typography sx={{ color: "#e53935", my: 3, fontSize: 20, textAlign: "center" }}>
          Booking details not found.
        </Typography>
      ) : (
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Avatar
              src={
                booking.photographer?.profilePicture
                  ? `http://localhost:5000/uploads/${booking.photographer.profilePicture}`
                  : undefined
              }
              sx={{
                width: 52,
                height: 52,
                background: "#FFD600",
                color: "#181818",
                fontSize: 30,
                boxShadow: "0 2px 8px #FFD60055"
              }}
            >
              <CameraAltIcon fontSize="inherit" />
            </Avatar>
            <Box>
              <Typography sx={{ color: "#FFD600", fontWeight: 700, fontSize: 19 }}>
                {booking.photographer?.shopName}
              </Typography>
              <Typography sx={{ color: "#fff", fontWeight: 500, fontSize: 16 }}>
                {booking.photographer?.photographerName}
              </Typography>
            </Box>
          </Box>
          <Typography sx={{
            color: "#ffe082", fontSize: 16, mb: 2, mt: 1.5,
            background: "#232323cc", px: 2, py: 1, borderRadius: 2
          }}>
            <b>Status Update:</b> {notifMessage}
          </Typography>
          <Box sx={{ color: "#fff", mb: 2, fontSize: 17 }}>
            <Box display="flex" alignItems="center" mb={1}>
              <EventAvailableIcon sx={{ color: "#FFD600", fontSize: 20, mr: 1 }} />
              {booking.eventType}
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <CalendarMonthIcon sx={{ color: "#FFD600", fontSize: 20, mr: 1 }} />
              {booking.date} &nbsp;
              <AccessTimeIcon sx={{ color: "#FFD600", fontSize: 20, ml: 2, mr: 1 }} />
              {booking.time}
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <LocationOnIcon sx={{ color: "#FFD600", fontSize: 20, mr: 1 }} />
              {booking.address}
            </Box>
            <Box sx={{ background: "#222c", px: 2, py: 1, borderRadius: 2, mb: 2 }}>
              {booking.description || <i style={{ color: "#FFD600" }}>No description</i>}
            </Box>
          </Box>
        </Box>
      )}
      <Box textAlign="center" mt={2}>
        <Button
          onClick={onClose}
          color="warning"
          variant="contained"
          size="large"
          sx={{
            fontWeight: 700,
            fontSize: 18,
            borderRadius: 7,
            px: 4,
            py: 1.2,
            background: "linear-gradient(90deg,#ffd600 60%,#fffde7 100%)",
            color: "#181818",
            boxShadow: "0 8px 22px #FFD60044",
            transition: "0.18s",
            "&:hover": {
              background: "linear-gradient(90deg,#fffde7 60%,#ffd600 100%)",
              color: "#000",
              transform: "scale(1.04)"
            }
          }}
        >
          Close
        </Button>
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
      setNotifications((res.data || []).filter((n) => !n.isRead && n.type === "status"));
    } catch (e) {
      setNotifError("Failed to load notifications");
    }
    setNotifLoading(false);
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleNotifClick = (event) => setNotifAnchorEl(event.currentTarget);
  const handleNotifClose = () => setNotifAnchorEl(null);

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

  const handleDialogClose = async () => {
    setDialogOpen(false);
    if (selectedNotif) {
      await markNotifAsRead(selectedNotif.id);
      setSelectedNotif(null);
    }
    setBookingDetails(null);
  };

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
