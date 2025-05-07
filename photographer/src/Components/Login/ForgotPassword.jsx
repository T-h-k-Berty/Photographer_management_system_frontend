import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography, Alert, Fade } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import 'bootstrap/dist/css/bootstrap.min.css';
import './ForgotPassword.css'; // 🔥 Optional for custom animations or styling

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(true);

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/send-otp", { email });
      setMessage(res.data.message);
      setError("");
      setShowAlert(true);
      localStorage.setItem("resetEmail", email);
      setTimeout(() => {
        window.location.href = "/verify-otp";
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Error sending OTP");
      setMessage("");
      setShowAlert(true);
    }
  };

  return (
    <Box
      className="d-flex align-items-center justify-content-center"
      sx={{
        minHeight: "100vh",
        background: "#0d0d0d",
        color: "white",
        padding: 2,
      }}
    >
      <Box
        className="shadow-lg animate__animated animate__fadeInDown"
        sx={{
          width: 400,
          background: "#1c1c1c",
          borderRadius: 4,
          padding: 4,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{ mb: 3, fontWeight: "bold", color: "#f5f5f5" }}
        >
          <EmailIcon sx={{ fontSize: 40, color: "#00d8ff", mr: 1 }} />
          Forgot Password
        </Typography>

        {message && showAlert && (
          <Fade in={true}>
            <Alert severity="success" onClose={() => setShowAlert(false)} sx={{ mb: 2 }}>
              {message}
            </Alert>
          </Fade>
        )}

        {error && showAlert && (
          <Fade in={true}>
            <Alert severity="error" onClose={() => setShowAlert(false)} sx={{ mb: 2 }}>
              {error}
            </Alert>
          </Fade>
        )}

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Enter your email to receive a reset OTP
        </Typography>
        <TextField
          fullWidth
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            input: { color: "white", backgroundColor: "#2a2a2a" },
            label: { color: "#ccc" },
            mb: 3,
          }}
          InputLabelProps={{
            style: { color: "#bbb" },
          }}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          className="btn btn-info text-white fw-bold"
          sx={{ py: 1.2, borderRadius: "30px" }}
          onClick={handleSubmit}
        >
          🚀 Send OTP
        </Button>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
