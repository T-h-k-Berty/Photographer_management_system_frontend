import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Slide,
  InputAdornment,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import "bootstrap/dist/css/bootstrap.min.css";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleVerify = async () => {
    try {
      const email = localStorage.getItem("resetEmail");
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
setMessage(res.data.message);
setError("");
setShowAlert(true);

// 🔐 Store OTP for reset-password
localStorage.setItem("verifiedOtp", otp);

setTimeout(() => {
  window.location.href = "/reset-password";
}, 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
      setMessage("");
      setShowAlert(true);
    }
  };

  return (
    <Box
      className="d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: "#0d0d0d",
        minHeight: "100vh",
        padding: "1rem",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#1a1a1a",
          color: "#fff",
          p: 4,
          borderRadius: 3,
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 0 20px rgba(0,0,0,0.7)",
        }}
      >
        <Box className="text-center mb-4">
          <VerifiedIcon sx={{ fontSize: 40, color: "#00d084" }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Verify OTP
          </Typography>
          <Typography variant="body2" sx={{ color: "#bbb" }}>
            Enter the OTP sent to your email
          </Typography>
        </Box>

        {showAlert && (
          <Slide in={true} direction="down">
            <div>
              {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            </div>
          </Slide>
        )}

        <TextField
          fullWidth
          label="OTP"
          variant="outlined"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          sx={{
            input: { color: "#fff" },
            label: { color: "#bbb" },
            mb: 3,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <VpnKeyIcon sx={{ color: "#888" }} />
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          variant="contained"
          color="success"
          onClick={handleVerify}
          sx={{
            py: 1.5,
            fontWeight: "bold",
            borderRadius: "30px",
            background: "linear-gradient(45deg, #00c853, #64dd17)",
            boxShadow: "0 4px 15px rgba(0,255,0,0.3)",
            "&:hover": {
              background: "linear-gradient(45deg, #64dd17, #00c853)",
            },
          }}
        >
          🔐 VERIFY OTP
        </Button>
      </Box>
    </Box>
  );
};

export default VerifyOtp;
