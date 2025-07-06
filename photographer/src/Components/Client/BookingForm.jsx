import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Grid,
  TextField,
  MenuItem,
  Button,
  Divider,
  InputAdornment,
  Tooltip,
  Fade,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DescriptionIcon from "@mui/icons-material/Description";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import StarIcon from "@mui/icons-material/Star";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useParams } from "react-router-dom";
import axios from "axios";
import TopBar from "../Photographer/TopBar/TopBar";

const eventTypes = [
  "Wedding",
  "Birthday",
  "Engagement",
  "Corporate Event",
  "Fashion Shoot",
  "Portrait",
  "Anniversary",
  "Other"
];

const BookingForm = () => {
  const { photographerId } = useParams();
  const [photographer, setPhotographer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [form, setForm] = useState({
    name: "",
    address: "",
    date: "",
    time: "",
    eventType: "",
    description: "",
    phone: ""
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchPhotographer = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/portfolios/user/${photographerId}`
        );
        if (isMounted) setPhotographer(res.data);
      } catch (e) {
        if (isMounted) setPhotographer(null);
      }
      if (isMounted) setLoading(false);
    };

    if (photographerId) fetchPhotographer();

    return () => { isMounted = false; };
  }, [photographerId]);

  // Input change handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name required";
    if (!form.address) newErrors.address = "Address required";
    if (!form.date) newErrors.date = "Date required";
    if (!form.time) newErrors.time = "Time required";
    if (!form.eventType) newErrors.eventType = "Event type required";
    if (!form.phone) newErrors.phone = "Phone number required";
    else if (!/^0\d{9}$/.test(form.phone)) newErrors.phone = "Enter valid Sri Lankan phone";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);

    try {
      // Assume JWT is stored in localStorage as "token"
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login first!");

      const res = await axios.post(
        "http://localhost:5000/api/bookings",
        { photographerId, ...form },
        { headers: { Authorization: token } }
      );

      setSnackbar({
        open: true,
        message: "Booking submitted! We’ll notify the photographer.",
        severity: "success"
      });

      setForm({
        name: "",
        address: "",
        date: "",
        time: "",
        eventType: "",
        description: "",
        phone: ""
      });
      setErrors({});
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to submit booking",
        severity: "error"
      });
    }
    setSubmitted(false);
  };

  // Card color theme
  const theme = {
    card: {
      background: "#181818",
      color: "#FFD600",
      borderRadius: 4,
      boxShadow: "0 8px 30px #0007",
      border: "2px solid #FFD600",
      position: "relative"
    },
    formPaper: { background: "#222", borderRadius: 5, boxShadow: "0 4px 24px #FFD60022" }
  };

  // MUI style
  const muiInputStyle = {
    input: { color: "#fff", background: "#1A1A1A", borderRadius: 3 },
    label: { color: "#FFD600" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#FFD600" },
      "&:hover fieldset": { borderColor: "#fff" },
      "&.Mui-focused fieldset": { borderColor: "#FFD600" },
    },
  };

  return (
    <>
      <TopBar />
    <Box sx={{ minHeight: "100vh", mx: "auto", mt: 3,background: "#131313", pb: 6, pt: 8 }}>
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={12} md={7} lg={6}>
          {/* === Photographer Summary Card === */}
          <Fade in>
            <Box
              sx={{
                ...theme.card,
                p: 2.5,
                mb: 4,
                display: "flex",
                alignItems: "center",
                gap: 2,
                background: "#181818",
                border: "2px solid #FFD600",
                borderRadius: "20px",
                boxShadow: "0 0 24px 2px #FFD60022",
                minHeight: 110,
                position: "relative"
              }}
            >
              {loading ? (
                <Box sx={{ minWidth: 70, display: "flex", justifyContent: "center" }}>
                  <CircularProgress size={40} sx={{ color: "#FFD600" }} />
                </Box>
              ) : (
                <Avatar
                  src={
                    photographer?.profilePicture
                      ? `http://localhost:5000/uploads/${photographer.profilePicture}`
                      : (photographer?.User?.profilePicture
                        ? `http://localhost:5000/${photographer.User.profilePicture.replace("\\", "/")}`
                        : undefined
                      )
                  }
                  sx={{
                    width: 70,
                    height: 70,
                    background: "#FFD600",
                    color: "#181818",
                    fontSize: 44,
                    mr: 2
                  }}
                >
                  {(!photographer?.profilePicture && !photographer?.User?.profilePicture) && <CameraAltIcon fontSize="inherit" />}
                </Avatar>
              )}
              <Box flex={1}>
                <Typography variant="h6" fontWeight="bold" color="#FFD600" sx={{ letterSpacing: "1.2px", mb: 0.2, fontSize: 22 }}>
                  {photographer
                    ? photographer.shopName || "Photographer Name"
                    : "Photographer Name"}
                </Typography>
                <Typography variant="body2" color="#FFFDE7" sx={{ fontWeight: 500, letterSpacing: 0.7, fontSize: 17 }}>
                  {photographer
                    ? photographer.photographerName || "Professional Photographer"
                    : "Professional Photographer"}
                </Typography>
                <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1.2, color: "#FFD600" }}>
                  <AssignmentIndIcon sx={{ fontSize: 20 }} />
                  <span style={{ fontWeight: 500, fontSize: 15 }}>
                    {photographer?.User?.rating !== undefined
                      ? photographer.User.rating
                      : "--"}{" "}
                    <StarIcon sx={{ color: "#FFD600", fontSize: 19, verticalAlign: "middle", ml: "-3px", mr: "-2px" }} />
                    ({photographer?.User?.ratingCount || 0})
                  </span>
                </Box>
              </Box>
            </Box>
          </Fade>
          {/* === Booking Form === */}
          <Paper sx={{ ...theme.formPaper, px: { xs: 2, md: 5 }, py: { xs: 3, md: 5 }, mb: 2 }}>
            <Typography variant="h4" fontWeight="bold" sx={{
              color: "#FFD600",
              mb: 1,
              letterSpacing: "1px",
              textAlign: "center",
            }}>
              <EventAvailableIcon sx={{ mb: "-7px", fontSize: 36, color: "#FFD600" }} /> Book Photographer
            </Typography>
            <Divider sx={{ mb: 3, borderColor: "#FFD600" }} />
            <form onSubmit={handleSubmit} autoComplete="off">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.name}
                    helperText={errors.name}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: "#FFD600" }} />
                        </InputAdornment>
                      )
                    }}
                    sx={muiInputStyle}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone Number"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.phone}
                    helperText={errors.phone}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocalPhoneIcon sx={{ color: "#FFD600" }} />
                        </InputAdornment>
                      )
                    }}
                    sx={muiInputStyle}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Location (Address)"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.address}
                    helperText={errors.address}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon sx={{ color: "#FFD600" }} />
                        </InputAdornment>
                      )
                    }}
                    sx={muiInputStyle}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Date"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.date}
                    helperText={errors.date}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthIcon sx={{ color: "#FFD600" }} />
                        </InputAdornment>
                      )
                    }}
                    sx={muiInputStyle}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Time"
                    name="time"
                    type="time"
                    value={form.time}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.time}
                    helperText={errors.time}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccessTimeIcon sx={{ color: "#FFD600" }} />
                        </InputAdornment>
                      )
                    }}
                    sx={muiInputStyle}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Event Type"
                    name="eventType"
                    value={form.eventType}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.eventType}
                    helperText={errors.eventType}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EventAvailableIcon sx={{ color: "#FFD600" }} />
                        </InputAdornment>
                      )
                    }}
                    sx={muiInputStyle}
                  >
                    {eventTypes.map((option, idx) => (
                      <MenuItem key={idx} value={option}>{option}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={2}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DescriptionIcon sx={{ color: "#FFD600" }} />
                        </InputAdornment>
                      )
                    }}
                    sx={muiInputStyle}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Tooltip title="Submit Booking" arrow placement="top">
                    <span>
                      <Button
                        type="submit"
                        variant="contained"
                        color="warning"
                        fullWidth
                        sx={{
                          borderRadius: 6,
                          fontWeight: 700,
                          fontSize: 18,
                          letterSpacing: "1px",
                          mt: 2,
                          py: 1.5,
                          boxShadow: "0 8px 22px #FFD60044",
                          background: "linear-gradient(90deg,#ffd600 60%,#fffde7 100%)",
                          color: "#181818",
                          "&:hover": {
                            background: "linear-gradient(90deg,#fffde7 60%,#ffd600 100%)",
                            color: "#000",
                          },
                          transition: "0.2s"
                        }}
                        disabled={submitted}
                      >
                        {submitted ? "Booking..." : "Book Now"}
                      </Button>
                    </span>
                  </Tooltip>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%", fontWeight: 700 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
    </>
  );
};

export default BookingForm;
