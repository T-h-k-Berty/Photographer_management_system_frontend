import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Avatar,
  Alert,
  IconButton
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import TopBar from "../Photographer/TopBar/TopBar"; // ✅ Use shared dynamic TopBar (not Photographer-specific)
import { useNavigate } from "react-router-dom"; // ✅ For redirection after update

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePicture: null,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored) {
      setUser(stored);
      setFormData({
        name: stored.name,
        email: stored.email,
        password: "",
        profilePicture: null,
      });
    }
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "profilePicture") {
      setFormData({ ...formData, profilePicture: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      if (formData.password) data.append("password", formData.password);
      if (formData.profilePicture) data.append("profilePicture", formData.profilePicture);

      const res = await axios.put(
        `http://localhost:5000/api/users/${user.id}/update`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage("Profile updated successfully!");
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);

      // ✅ Redirect to home after 1.5 seconds
      setTimeout(() => {
        navigate("/PhotographerHome");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    }
  };

  if (!user) return null;

  const previewUrl = formData.profilePicture
    ? URL.createObjectURL(formData.profilePicture)
    : `http://localhost:5000/${user.profilePicture}`;

  return (
    <>
      {/* TopBar */}
      <TopBar />

      {/* Edit Profile Form */}
      <Box
        sx={{
          maxWidth: 600,
          mx: "auto",
          mt: 14, // space for fixed TopBar
          p: 4,
          borderRadius: 3,
          backgroundColor: "#111",
          color: "#fff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Box position="relative" display="inline-block">
            <Avatar
              src={previewUrl}
              sx={{ width: 100, height: 100, border: "3px solid white" }}
            />
            <IconButton
              onClick={handleAvatarClick}
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "#333",
                color: "white",
                ":hover": { backgroundColor: "#555" },
              }}
            >
              <EditIcon />
            </IconButton>
            <input
              type="file"
              name="profilePicture"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleChange}
              style={{ display: "none" }}
            />
          </Box>
        </Box>

        <Typography
          variant="h5"
          textAlign="center"
          fontWeight="bold"
          gutterBottom
        >
          Edit Profile
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="name"
                value={formData.name}
                onChange={handleChange}
                label="Name"
                InputLabelProps={{ style: { color: "#ccc" } }}
                InputProps={{ style: { color: "#fff", backgroundColor: "#222" } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleChange}
                label="Email"
                InputLabelProps={{ style: { color: "#ccc" } }}
                InputProps={{ style: { color: "#fff", backgroundColor: "#222" } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="password"
                type="password"
                onChange={handleChange}
                label="New Password"
                placeholder="Leave blank to keep same"
                InputLabelProps={{ style: { color: "#ccc" } }}
                InputProps={{ style: { color: "#fff", backgroundColor: "#222" } }}
              />
            </Grid>
          </Grid>

          <Box textAlign="center" mt={4}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ borderRadius: "30px", px: 5, py: 1 }}
            >
              Update Profile
            </Button>
          </Box>
        </form>
      </Box>
    </>
  );
};

export default EditProfile;
