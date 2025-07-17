import React, { useEffect, useState, useCallback } from "react";
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Chip, Avatar, Button, CircularProgress, Grid, Tooltip
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import TopBar from "../TopBar/TopBar";
import axios from "axios";
import Footer from "../Footer/Footer";

// --- Status chip mapping ---
const statusMap = {
  accepted: {
    label: "Accepted",
    color: "#2cff6e",
    icon: <CheckCircleIcon sx={{ fontSize: 22, verticalAlign: "-5px" }} />
  },
  canceled: {
    label: "Cancelled",
    color: "#e53935",
    icon: <CancelIcon sx={{ fontSize: 22, verticalAlign: "-5px" }} />
  },
  pending: {
    label: "Pending",
    color: "#FFD600",
    icon: <HourglassEmptyIcon sx={{ fontSize: 22, verticalAlign: "-5px" }} />
  }
};

const getStatusChip = (status) => {
  const s = statusMap[status?.toLowerCase()] || statusMap.pending;
  return (
    <Chip
      label={s.label}
      icon={s.icon}
      sx={{
        background: s.color,
        color: "#181818",
        fontWeight: "bold",
        fontSize: 17,
        px: 2,
        py: 1,
        borderRadius: "14px",
        boxShadow: "0 2px 10px 0 #0004",
        letterSpacing: 0.7
      }}
    />
  );
};

// --- Button styles for consistency ---
const headerCellStyle = {
  color: "#FFD600", fontWeight: 700, fontSize: 18, borderBottom: "2px solid #FFD600"
};
const acceptBtnStyle = {
  borderRadius: 6,
  fontWeight: 700,
  fontSize: 15,
  background: "linear-gradient(90deg,#2cff6e 70%,#FFD600 100%)",
  color: "#181818",
  boxShadow: "0 3px 10px #2cff6e33",
  "&:hover": { background: "linear-gradient(90deg,#FFD600 60%,#2cff6e 100%)" }
};
const cancelBtnStyle = {
  borderRadius: 6,
  fontWeight: 700,
  fontSize: 15,
  background: "linear-gradient(90deg,#FFD600 20%,#e53935 100%)",
  color: "#181818",
  boxShadow: "0 3px 10px #e5393555",
  "&:hover": { background: "linear-gradient(90deg,#e53935 60%,#FFD600 100%)", color: "#fff" }
};

const PhotographerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // bookingId being acted upon
  const user = JSON.parse(localStorage.getItem("user"));

  // --- Fetch all bookings for this photographer ---
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/bookings/photographer/${user.id}`,
        { headers: { Authorization: token } }
      );
      setBookings(res.data || []);
    } catch {
      setBookings([]);
    }
    setLoading(false);
  }, [user.id]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // --- Accept or Cancel a booking ---
  const handleBookingAction = async (bookingId, action) => {
    setActionLoading(bookingId);
    try {
      const token = localStorage.getItem("token");
      const url =
        action === "accept"
          ? `http://localhost:5000/api/bookings/accept/${bookingId}`
          : `http://localhost:5000/api/bookings/cancel/${bookingId}`;
      await axios.put(url, {}, { headers: { Authorization: token } });
      await fetchBookings();
    } catch (e) {
      alert("Failed to update booking status.");
    }
    setActionLoading(null);
  };

  return (
    <>
      <TopBar />
      <Box sx={{
        minHeight: "100vh",
        background: "#131313",
        pt: { xs: 10, md: 12 },
        pb: 8,
        px: { xs: 1, md: 6 },
      }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} lg={10}>
            <Paper
              elevation={8}
              sx={{
                background: "rgba(25,25,25,0.98)",
                borderRadius: "25px",
                boxShadow: "0 8px 32px #FFD60033, 0 1.5px 12px #000b",
                border: "2.5px solid #FFD600",
                px: { xs: 1, md: 3 },
                py: { xs: 2, md: 4 }
              }}
            >
              <Box mb={3} textAlign="center">
                <Typography
                  variant="h4"
                  sx={{
                    color: "#FFD600",
                    fontWeight: 800,
                    letterSpacing: "2px",
                    mb: 0.8
                  }}
                >
                  <CameraAltIcon sx={{ mb: "-6px", mr: 1, fontSize: 38 }} />
                  My Bookings
                </Typography>
                <Typography sx={{ color: "#fffde7", fontSize: 18 }}>
                  All bookings requested by clients. Accept or cancel requests below.
                </Typography>
              </Box>
              {loading ? (
                <Box sx={{ textAlign: "center", py: 5 }}>
                  <CircularProgress size={55} sx={{ color: "#FFD600" }} />
                </Box>
              ) : bookings.length === 0 ? (
                <Typography sx={{ color: "#FFD600", textAlign: "center", fontSize: 23, py: 5 }}>
                  No bookings yet!
                </Typography>
              ) : (
                <TableContainer sx={{
                  borderRadius: "18px",
                  background: "rgba(27,27,27,0.96)",
                  boxShadow: "0 2px 16px #FFD60022",
                  overflow: "auto"
                }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={headerCellStyle}>Client</TableCell>
                        <TableCell sx={headerCellStyle}>Event</TableCell>
                        <TableCell sx={headerCellStyle}>Date/Time</TableCell>
                        <TableCell sx={headerCellStyle}>Location</TableCell>
                        <TableCell sx={headerCellStyle}>Description</TableCell>
                        <TableCell sx={headerCellStyle}>Status</TableCell>
                        <TableCell sx={headerCellStyle}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bookings.map((b) => (
                        <TableRow
                          key={b.id}
                          sx={{
                            background: "linear-gradient(90deg,#202020 85%,#FFD60008 100%)",
                            "&:hover": { background: "#252525" }
                          }}
                        >
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1.4}>
                              <Avatar
                                src={b.Client?.profilePicture ? `http://localhost:5000/${b.Client.profilePicture}` : undefined}
                                sx={{ width: 42, height: 42, bgcolor: "#FFD600", color: "#181818" }}
                              >
                                <CameraAltIcon />
                              </Avatar>
                              <Box>
                                <Typography sx={{ color: "#FFD600", fontWeight: 700, fontSize: 17 }}>
                                  {b.Client?.name}
                                </Typography>
                                <Typography sx={{ color: "#fffde7", fontSize: 15 }}>
                                  {b.Client?.email}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: "#FFD600", fontWeight: 600, fontSize: 16 }}>
                            <EventAvailableIcon sx={{ mr: 0.5, fontSize: 19 }} />
                            {b.eventType}
                          </TableCell>
                          <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                            <CalendarMonthIcon sx={{ color: "#FFD600", fontSize: 19, mr: 0.5 }} />
                            {b.date}
                            <AccessTimeIcon sx={{ color: "#FFD600", fontSize: 19, ml: 1, mr: 0.5 }} />
                            {b.time}
                          </TableCell>
                          <TableCell sx={{ color: "#fffde7", fontSize: 15 }}>
                            <LocationOnIcon sx={{ color: "#FFD600", fontSize: 17, mr: 0.5 }} />
                            {b.address}
                          </TableCell>
                          <TableCell sx={{ color: "#fffde7", fontSize: 15 }}>
                            {b.description || <i style={{ color: "#FFD600" }}>No description</i>}
                          </TableCell>
                          <TableCell>{getStatusChip(b.status)}</TableCell>
                          <TableCell>
                            <Grid container spacing={1}>
                              <Grid item>
                                <Tooltip title="Accept Booking" arrow>
                                  <span>
                                    <Button
                                      variant="contained"
                                      color="success"
                                      size="small"
                                      disabled={b.status?.toLowerCase() === "accepted" || b.status?.toLowerCase() === "canceled" || actionLoading === b.id}
                                      startIcon={<CheckCircleIcon />}
                                      sx={acceptBtnStyle}
                                      onClick={() => handleBookingAction(b.id, "accept")}
                                    >
                                      {actionLoading === b.id && b.status?.toLowerCase() === "pending"
                                        ? <CircularProgress size={19} sx={{ color: "#181818" }} />
                                        : "Accept"}
                                    </Button>
                                  </span>
                                </Tooltip>
                              </Grid>
                              <Grid item>
                                <Tooltip title="Cancel Booking" arrow>
                                  <span>
                                    <Button
                                      variant="contained"
                                      color="error"
                                      size="small"
                                      disabled={b.status?.toLowerCase() === "canceled" || b.status?.toLowerCase() === "accepted" || actionLoading === b.id}
                                      startIcon={<CancelIcon />}
                                      sx={cancelBtnStyle}
                                      onClick={() => handleBookingAction(b.id, "cancel")}
                                    >
                                      {actionLoading === b.id && b.status?.toLowerCase() === "pending"
                                        ? <CircularProgress size={19} sx={{ color: "#181818" }} />
                                        : "Cancel"}
                                    </Button>
                                  </span>
                                </Tooltip>
                              </Grid>
                            </Grid>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </>
  );
};

export default PhotographerBookings;
