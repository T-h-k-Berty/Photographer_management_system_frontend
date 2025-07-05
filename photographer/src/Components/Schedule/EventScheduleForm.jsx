import React, { useState, useEffect } from "react";
import {
  Box, Typography, TextField, Button, Grid, Paper, MenuItem,
  IconButton, Tooltip, Divider
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import TopBar from "../Photographer/TopBar/TopBar";

// Sri Lankan districts
const places = [
  "Ampara","Anuradhapura","Badulla","Batticaloa","Colombo","Galle","Gampaha","Hambantota","Jaffna","Kalutara","Kandy","Kegalle","Kilinochchi","Kurunegala","Mannar","Matale","Matara","Monaragala","Mullaitivu","Nuwara Eliya","Polonnaruwa","Puttalam","Ratnapura","Trincomalee","Vavuniya"
];

const muiInputStyle = {
  input: { color: "#fff", background: "#1A1A1A", borderRadius: 3 },
  label: { color: "#FFD600" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "white" },
    "&:hover fieldset": { borderColor: "#fff" },
    "&.Mui-focused fieldset": { borderColor: "#FFD600" },
  },
};
const emptyEvent = { name: "", place: "", date: "", start: "", end: "" };

const EventScheduleForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [events, setEvents] = useState([{ ...emptyEvent }]);
  const [errors, setErrors] = useState([{}]);
  const [isEdit, setIsEdit] = useState(false);
  const [editEventId, setEditEventId] = useState(null);

  // User auth
  const user = JSON.parse(localStorage.getItem("user")); // update if using context/auth
  const token = localStorage.getItem("token");

  // If editing, prefill the form
  useEffect(() => {
    if (location.state?.event) {
      setIsEdit(true);
      setEditEventId(location.state.event.id);
      setEvents([{ ...location.state.event }]);
      setErrors([{}]);
    } else if (params.id) {
      // If routed via /edit/:id, fetch data (optional, fallback)
      fetchEventById(params.id);
    }
    // eslint-disable-next-line
  }, [location.state, params.id]);

  const fetchEventById = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/events/${id}`, {
        headers: { Authorization: token }
      });
      setIsEdit(true);
      setEditEventId(res.data.id);
      setEvents([{ ...res.data }]);
    } catch (err) {
      alert("Failed to load event for editing.");
      navigate("/photographer/UpcomingEventSchedule");
    }
  };

  // Add/Remove/Change event logic (same as before)
  const handleAddEvent = () => {
    if (!isEdit && events.length < 3) {
      setEvents([...events, { ...emptyEvent }]);
      setErrors([...errors, {}]);
    }
  };
  const handleRemoveEvent = (idx) => {
    if (!isEdit && events.length > 1) {
      setEvents(events.filter((_, i) => i !== idx));
      setErrors(errors.filter((_, i) => i !== idx));
    }
  };
  const handleChange = (idx, e) => {
    const newEvents = [...events];
    newEvents[idx][e.target.name] = e.target.value;
    setEvents(newEvents);
    const newErrors = [...errors];
    newErrors[idx][e.target.name] = "";
    setErrors(newErrors);
  };

  // Validation (same)
  const validate = () => {
    let valid = true;
    const newErrors = events.map((event) => {
      let err = {};
      if (!event.name) err.name = "Event name required";
      if (!event.place) err.place = "Place required";
      if (!event.date) err.date = "Date required";
      if (!event.start) err.start = "Start time required";
      if (!event.end) err.end = "End time required";
      if (event.start && event.end && event.start >= event.end)
        err.end = "End time must be after start time";
      if (Object.keys(err).length > 0) valid = false;
      return err;
    });
    setErrors(newErrors);
    return valid;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !token) {
      alert("Login required");
      return;
    }
    if (!validate()) return;

    try {
      if (isEdit) {
        // Single edit
        const payload = {
          ...events[0],
          userId: user.id,
        };
        await axios.put(`http://localhost:5000/api/events/${editEventId}`, payload, {
          headers: { Authorization: token },
        });
        alert("Event updated!");
      } else if (events.length === 1) {
        // Single create
        const payload = {
          ...events[0],
          userId: user.id,
        };
        await axios.post("http://localhost:5000/api/events", payload, {
          headers: { Authorization: token },
        });
        alert("Event added!");
      } else {
        // Multiple create
        const payload = {
          userId: user.id,
          events,
        };
        await axios.post("http://localhost:5000/api/events/bulk", payload, {
          headers: { Authorization: token },
        });
        alert("Events added!");
      }
      navigate("/photographer/UpcomingEventSchedule");
    } catch (err) {
      alert("Failed to save event(s): " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <>
      <TopBar />
      <Box sx={{ background: "#171717", minHeight: "100vh",mx: "auto", mt: 5, p: { xs: 2, md: 4 } }}>
        <Grid container alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Grid item>
            <Tooltip title="Back">
              <IconButton onClick={() => navigate("/photographer/UpcomingEventSchedule")} sx={{ color: "white" }}>
                <ArrowBackIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
              {isEdit ? "Edit Event" : "Add New Events"}
            </Typography>
          </Grid>
        </Grid>

        <Paper sx={{ p: { xs: 2, md: 4 }, background: "#232323", borderRadius: 5, boxShadow: 4, maxWidth: 700, mx: "auto" }}>
          <form onSubmit={handleSubmit} autoComplete="off">
            {events.map((event, idx) => (
              <Box key={idx} sx={{ border: "2px solid white", borderRadius: 4, boxShadow: 2, p: 3, mb: events.length > 1 ? 4 : 2, position: "relative", background: "#191919" }}>
                <Grid container alignItems="center" spacing={2} sx={{ mb: 1 }}>
                  <Grid item>
                    <EventIcon sx={{ color: "white", fontSize: 32, mr: 1 }} />
                  </Grid>
                  <Grid item>
                    <Typography variant="h6" sx={{ color: "white", fontWeight: 700 }}>
                      Event {idx + 1}
                    </Typography>
                  </Grid>
                  <Grid item xs />
                  {!isEdit && events.length > 1 && (
                    <Grid item>
                      <Tooltip title="Remove this event">
                        <IconButton onClick={() => handleRemoveEvent(idx)} sx={{ color: "#FF5252", background: "#232323", "&:hover": { background: "#ffebee" } }}>
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  )}
                  {!isEdit && idx === events.length - 1 && events.length < 3 && (
                    <Grid item>
                      <Tooltip title="Add event">
                        <IconButton onClick={handleAddEvent} sx={{ color: "white", background: "#232323", "&:hover": { background: "#fffde7" } }}>
                          <AddCircleOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  )}
                </Grid>
                <Divider sx={{ mb: 2, borderColor: "white" }} />
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField label="Event Name" name="name" value={event.name}
                      onChange={(e) => handleChange(idx, e)} fullWidth required
                      error={!!errors[idx]?.name} helperText={errors[idx]?.name} sx={muiInputStyle}
                      InputLabelProps={{ style: { color: "white" } }} autoFocus={idx === 0} />
                  </Grid>
                  <Grid item xs={12} sm={7}>
                    <TextField select label="Place" name="place" value={event.place}
                      onChange={(e) => handleChange(idx, e)} fullWidth required
                      error={!!errors[idx]?.place} helperText={errors[idx]?.place} sx={muiInputStyle}
                      InputLabelProps={{ style: { color: "white" } }}>
                      {places.map((place) => (
                        <MenuItem key={place} value={place}>{place}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField label="Date" type="date" name="date" value={event.date}
                      onChange={(e) => handleChange(idx, e)} fullWidth required
                      error={!!errors[idx]?.date} helperText={errors[idx]?.date} sx={muiInputStyle}
                      InputLabelProps={{ shrink: true, style: { color: "white" } }} />
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <TextField label="Start Time" type="time" name="start" value={event.start}
                      onChange={(e) => handleChange(idx, e)} fullWidth required
                      error={!!errors[idx]?.start} helperText={errors[idx]?.start} sx={muiInputStyle}
                      InputLabelProps={{ shrink: true, style: { color: "white" } }}
                      InputProps={{
                        startAdornment: <AccessTimeIcon sx={{ color: "white", mr: 1 }} />,
                      }} />
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <TextField label="End Time" type="time" name="end" value={event.end}
                      onChange={(e) => handleChange(idx, e)} fullWidth required
                      error={!!errors[idx]?.end} helperText={errors[idx]?.end} sx={muiInputStyle}
                      InputLabelProps={{ shrink: true, style: { color: "white" } }}
                      InputProps={{
                        startAdornment: <AccessTimeIcon sx={{ color: "white", mr: 1 }} />,
                      }} />
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Button type="submit" variant="contained" color="warning" startIcon={<SaveIcon />} fullWidth
              sx={{ borderRadius: 8, fontWeight: 700, fontSize: 18, mt: 2, py: 1.2, boxShadow: 3, textTransform: "none" }}>
              {isEdit ? "Save Changes" : `Add Event${events.length > 1 ? "s" : ""}`}
            </Button>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default EventScheduleForm;
