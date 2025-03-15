import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Grid, Typography, Box, Button, TextField, Alert } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import backgroundImg from "../SignUp/background.png";

const PhotographerSignUp = () => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "profilePicture") {
      setFormData({ ...formData, profilePicture: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // ✅ Validation: Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // ✅ Validation: Check password length
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("role", "photographer"); 
    if (formData.profilePicture) {
      data.append("profilePicture", formData.profilePicture);
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "90%",
          maxWidth: "500px",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          borderRadius: "10px",
          p: 4,
          color: "white",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
        }}
      >
        <Box mb={2}>
          <Button startIcon={<ArrowBackIcon />} variant="text" sx={{ color: "white", fontWeight: "bold" }} onClick={() => window.history.back()}>
            Back
          </Button>
        </Box>

        <Box textAlign="center" mb={3}>
          <CameraAltIcon sx={{ fontSize: 80, color: "white" }} />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth name="name" variant="outlined" placeholder="Enter your name" onChange={handleChange} InputProps={{ sx: { backgroundColor: "#444", color: "white" } }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth name="email" variant="outlined" placeholder="Enter your email" onChange={handleChange} InputProps={{ sx: { backgroundColor: "#444", color: "white" } }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth name="password" type="password" variant="outlined" placeholder="Enter your password" onChange={handleChange} InputProps={{ sx: { backgroundColor: "#444", color: "white" } }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth name="confirmPassword" type="password" variant="outlined" placeholder="Re-enter your password" onChange={handleChange} InputProps={{ sx: { backgroundColor: "#444", color: "white" } }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth type="file" variant="outlined" onChange={handleChange} name="profilePicture" InputLabelProps={{ shrink: true }} InputProps={{ sx: { backgroundColor: "#444", color: "white", borderRadius: "5px" } }} />
            </Grid>
          </Grid>

          <Box textAlign="center" mt={3}>
            <Button type="submit" variant="contained" sx={{ backgroundColor: "white", color: "black", fontWeight: "bold", borderRadius: "30px", px: 5, py: 1, ":hover": { backgroundColor: "#ddd" } }}>
              Create Account
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default PhotographerSignUp;
