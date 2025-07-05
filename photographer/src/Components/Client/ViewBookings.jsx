import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DescriptionIcon from "@mui/icons-material/Description";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import InfoIcon from "@mui/icons-material/Info";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const statusMap = {
  pending: {
    label: "Pending",
    color: "#FFD600",
    icon: <HourglassEmptyIcon sx={{ fontSize: 18 }} />
  },
  accepted: {
    label: "Accepted",
    color: "#43a047",
    icon: <CheckCircleIcon sx={{ fontSize: 18 }} />
  },
  cancelled: {
    label: "Cancelled",
    color: "#e53935",
    icon: <CancelIcon sx={{ fontSize: 18 }} />
  }
};

const theme = {
  card: {
    background: "#181818",
    color: "#FFD600",
    borderRadius: "18px",
    boxShadow: "0 8px 40px 0 #000a",
    border: "2px solid #FFD600",
    marginBottom: "32px",
    transition: "transform 0.2s, box-shadow 0.2s"
  },
  detailPaper: {
    background: "#222",
    borderRadius: "16px",
    boxShadow: "0 8px 24px #FFD60022"
  }
};

const getClientIdAndToken = () => {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {}
  const clientId = user?.id || localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  return { clientId, token };
};

function normalizeProfilePicture(pic) {
  // Accepts undefined/null or string, always returns string or undefined
  if (!pic) return undefined;
  // Remove leading "uploads\" or "uploads/" if present (optional)
  const path = pic.replace(/\\/g, "/");
  return `http://localhost:5000/${path.startsWith("uploads/") ? path : "uploads/" + path}`;
}

const ViewBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const { clientId, token } = getClientIdAndToken();

  useEffect(() => {
    if (!clientId || !token) {
      setBookings([]);
      setLoading(false);
      setSnackbar({
        open: true,
        message: "Login required to view bookings",
        severity: "error"
      });
      return;
    }
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/bookings/client/${clientId}`,
          { headers: { Authorization: token } }
        );
        setBookings(res.data || []);
      } catch (err) {
        setBookings([]);
        setSnackbar({
          open: true,
          message: err.response?.data?.message || "Failed to fetch bookings",
          severity: "error"
        });
      }
      setLoading(false);
    };
    fetchBookings();
  }, [clientId, token]);

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setOpen(true);
  };

  const getStatusBadge = (status) => {
    const s = statusMap[(status || "").toLowerCase()] || statusMap.pending;
    return (
      <Chip
        label={s.label}
        icon={s.icon}
        sx={{
          background: s.color,
          color: "#181818",
          fontWeight: "bold",
          px: 1.5,
          fontSize: 15,
          letterSpacing: 0.7,
          borderRadius: "14px"
        }}
      />
    );
  };

  // Helper to get photographer info from booking
  const getPhotographerInfo = (booking) => {
    const photographer = booking.Photographer || {};
    const portfolio = photographer.Portfolio || {};
    return {
      shopName: portfolio.shopName || "Photographer",
      photographerName: portfolio.photographerName || photographer.name || "Unknown",
      profilePicture: normalizeProfilePicture(photographer.profilePicture)
    };
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ background: "#121212", minHeight: "100vh", py: 7, px: { xs: 2, md: 5 } }}>
      <Typography
        variant="h3"
        fontWeight="bold"
        gutterBottom
        sx={{
          color: "#FFD600",
          mb: 5,
          textAlign: "center",
          letterSpacing: 1.2,
          textShadow: "1px 2px 6px #0007"
        }}
      >
        My Bookings
      </Typography>
      {loading ? (
        <Box sx={{ textAlign: "center", mt: 10 }}>
          <CircularProgress size={48} sx={{ color: "#FFD600" }} />
        </Box>
      ) : bookings.length === 0 ? (
        <Typography sx={{ textAlign: "center", color: "#fff", mt: 8, fontSize: 22 }}>
          {clientId ? "No bookings found." : "Please log in to view your bookings."}
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking, i) => {
            const photographerInfo = getPhotographerInfo(booking);
            return (
              <Grid item xs={12} sm={12} md={6} lg={4} key={booking.id || i}>
                <Paper
                  sx={{
                    ...theme.card,
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: "0 10px 44px #FFD60033"
                    }
                  }}
                  className="shadow-sm"
                >
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center", p: 3 }}>
                    <Avatar
                      src={photographerInfo.profilePicture}
                      sx={{
                        width: 62,
                        height: 62,
                        background: "#FFD600",
                        color: "#181818",
                        fontSize: 38
                      }}
                    >
                      {(!photographerInfo.profilePicture) && <CameraAltIcon fontSize="inherit" />}
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="h6" fontWeight="bold" color="#FFD600">
                        {photographerInfo.shopName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#FFFDE7", fontWeight: 500, fontSize: 16 }}>
                        <PersonIcon sx={{ fontSize: 16, mb: "-3px", mr: 0.5 }} />
                        {photographerInfo.photographerName}
                      </Typography>
                      <Box sx={{ mt: 1, mb: 0.5 }}>
                        {getStatusBadge(booking.status)}
                      </Box>
                    </Box>
                  </Box>
                  <Divider sx={{ borderColor: "#FFD600", mx: 2 }} />
                  <Box sx={{ p: 2.5 }}>
                    <Typography variant="body2" sx={{ color: "#FFD600", fontWeight: 700, mb: 1 }}>
                      <EventAvailableIcon sx={{ fontSize: 19, mr: 0.5 }} />
                      {booking.eventType}
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography sx={{ color: "#fff", fontSize: 15, mb: 0.6 }}>
                          <CalendarMonthIcon sx={{ color: "#FFD600", fontSize: 16, mr: 0.6 }} />
                          {booking.date}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography sx={{ color: "#fff", fontSize: 15 }}>
                          <AccessTimeIcon sx={{ color: "#FFD600", fontSize: 16, mr: 0.6 }} />
                          {booking.time}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography sx={{ color: "#fffde7", fontSize: 15, mt: 0.5 }}>
                          <LocationOnIcon sx={{ color: "#FFD600", fontSize: 16, mr: 0.7 }} />
                          {booking.address}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: 1.5, display: "flex", justifyContent: "end" }}>
                      <Tooltip title="View Details" arrow>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            borderColor: "#FFD600",
                            color: "#FFD600",
                            fontWeight: 700,
                            borderRadius: 8,
                            px: 2,
                            "&:hover": { background: "#FFD600", color: "#181818" }
                          }}
                          startIcon={<InfoIcon />}
                          onClick={() => handleView(booking)}
                        >
                          Details
                        </Button>
                      </Tooltip>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Details Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle
          sx={{
            background: "#181818",
            color: "#FFD600",
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: 1
          }}
        >
          Booking Details
        </DialogTitle>
        <DialogContent sx={{ ...theme.detailPaper, pt: 3, pb: 3, px: 2 }}>
          {selectedBooking && (() => {
            const photographerInfo = getPhotographerInfo(selectedBooking);
            return (
              <>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    src={photographerInfo.profilePicture}
                    sx={{
                      width: 56,
                      height: 56,
                      background: "#FFD600",
                      color: "#181818",
                      fontSize: 32,
                      mr: 2
                    }}
                  >
                    {(!photographerInfo.profilePicture) && <CameraAltIcon fontSize="inherit" />}
                  </Avatar>
                  <Box>
                    <Typography fontWeight="bold" sx={{ color: "#FFD600", fontSize: 18 }}>
                      {photographerInfo.shopName}
                    </Typography>
                    <Typography sx={{ color: "#fff", fontSize: 15 }}>
                      {photographerInfo.photographerName}
                    </Typography>
                    <Box sx={{ mt: 0.7 }}>
                      {getStatusBadge(selectedBooking.status)}
                    </Box>
                  </Box>
                </Box>
                <Divider sx={{ borderColor: "#FFD600", mb: 2 }} />
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography sx={{ color: "#FFD600", fontWeight: 600, fontSize: 16 }}>
                      <EventAvailableIcon sx={{ fontSize: 18, mr: 1 }} />
                      {selectedBooking.eventType}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ color: "#fff" }}>
                      <CalendarMonthIcon sx={{ color: "#FFD600", fontSize: 16, mr: 0.7 }} />
                      {selectedBooking.date}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ color: "#fff" }}>
                      <AccessTimeIcon sx={{ color: "#FFD600", fontSize: 16, mr: 0.7 }} />
                      {selectedBooking.time}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography sx={{ color: "#fffde7", mb: 1 }}>
                      <LocationOnIcon sx={{ color: "#FFD600", fontSize: 16, mr: 1 }} />
                      {selectedBooking.address}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography sx={{ color: "#fffde7" }}>
                      <DescriptionIcon sx={{ color: "#FFD600", fontSize: 16, mr: 1 }} />
                      {selectedBooking.description || <i>No description</i>}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ borderColor: "#FFD600", mt: 2, mb: 2 }} />
                <Typography variant="caption" sx={{ color: "#FFD600" }}>
                  Booking placed on:{" "}
                  <span style={{ color: "#fff" }}>
                    {selectedBooking.createdAt && new Date(selectedBooking.createdAt).toLocaleString()}
                  </span>
                </Typography>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%", fontWeight: 700 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ViewBookings;
