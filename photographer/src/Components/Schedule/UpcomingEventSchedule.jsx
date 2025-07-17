import React, { useEffect, useState } from "react";
import {
  Box, Typography, IconButton, Tooltip, Button, Paper, Table,
  TableHead, TableBody, TableRow, TableCell, Grid
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TopBar from "../Photographer/TopBar/TopBar";
import Footer from "../Photographer/Footer/Footer";

const UpcomingEventSchedule = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // User auth
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line
  }, []);

  const fetchEvents = async () => {
    if (!user || !token) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/events/user/${user.id}`, {
        headers: { Authorization: token },
      });
      setEvents(res.data);
    } catch (err) {
      alert("Failed to load events: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    navigate("/photographer/EventScheduleForm");
  };

  const handleEdit = (event) => {
    // Pass event data via state
    navigate("/photographer/EventScheduleForm", { state: { event } });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this event?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`, {
        headers: { Authorization: token },
      });
      setEvents(events.filter(e => e.id !== id));
      alert("Event deleted.");
    } catch (err) {
      alert("Failed to delete: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <>
      <TopBar />
      <Box sx={{ background: "#171717", minHeight: "100vh", mx: "auto", mt: 5, padding: { xs: 2, md: 4 } }}>
        <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ color: "#FFD600", fontWeight: 700 }}>
            📅 Upcoming Event Schedule
          </Typography>
          <Button
            variant="contained"
            color="warning"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleAddNew}
            sx={{
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 18,
              px: 3,
              boxShadow: 3,
              textTransform: "none",
            }}
          >
            Add New
          </Button>
        </Grid>

        <Paper sx={{
          background: "#222",
          borderRadius: 5,
          boxShadow: 4,
          p: 2,
          mt: 2,
        }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#FFD600", fontWeight: 700, fontSize: 18 }}>Event Name</TableCell>
                <TableCell sx={{ color: "#FFD600", fontWeight: 700, fontSize: 18 }}>Place</TableCell>
                <TableCell sx={{ color: "#FFD600", fontWeight: 700, fontSize: 18 }}>Date</TableCell>
                <TableCell sx={{ color: "#FFD600", fontWeight: 700, fontSize: 18 }}>Start Time</TableCell>
                <TableCell sx={{ color: "#FFD600", fontWeight: 700, fontSize: 18 }}>End Time</TableCell>
                <TableCell sx={{ color: "#FFD600", fontWeight: 700, fontSize: 18, textAlign: "center" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ color: "#aaa" }}>
                    Loading events...
                  </TableCell>
                </TableRow>
              ) : events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ color: "#aaa" }}>
                    No upcoming events scheduled.
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <TableRow key={event.id} hover sx={{
                    background: "#232323",
                    "&:hover": { background: "#292929" }
                  }}>
                    <TableCell sx={{ color: "#fff", fontWeight: 600 }}>{event.name}</TableCell>
                    <TableCell sx={{ color: "#fff" }}>{event.place}</TableCell>
                    <TableCell sx={{ color: "#fff" }}>{event.date}</TableCell>
                    <TableCell sx={{ color: "#fff" }}>{event.start}</TableCell>
                    <TableCell sx={{ color: "#fff" }}>{event.end}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => handleEdit(event)}
                          sx={{ color: "#FFD600", mx: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => handleDelete(event.id)}
                          sx={{
                            color: "#FF5252",
                            mx: 1,
                            "&:hover": { background: "#400" }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      </Box>
      <Footer />
    </>
  );
};

export default UpcomingEventSchedule;
