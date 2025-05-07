import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  Slide,
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import LockIcon from "@mui/icons-material/Lock";
import "bootstrap/dist/css/bootstrap.min.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleReset = async () => {
    try {
      const email = localStorage.getItem("resetEmail");
      const otp = localStorage.getItem("verifiedOtp"); // 💡 Get OTP
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", {
        email,
        otp,
        newPassword: password, // ✅ Send with correct key name
      });
      setMessage(res.data.message);
      setError("");
      setShowAlert(true);
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("verifiedOtp"); // ✅ Clear OTP
      setTimeout(() => (window.location.href = "/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password");
      setMessage("");
      setShowAlert(true);
    }
  };
  

  return (
    <Box
      className="d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "#0d0d0d", minHeight: "100vh", padding: "1rem" }}
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
          <LockResetIcon sx={{ fontSize: 40, color: "#29b6f6" }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Reset Password
          </Typography>
          <Typography variant="body2" sx={{ color: "#bbb" }}>
            Enter your new password to update your account
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
          type="password"
          label="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          sx={{
            input: { color: "#fff" },
            label: { color: "#bbb" },
            mb: 3,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon sx={{ color: "#888" }} />
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleReset}
          sx={{
            py: 1.5,
            fontWeight: "bold",
            borderRadius: "30px",
            background: "linear-gradient(to right, #2196f3, #21cbf3)",
            boxShadow: "0 4px 15px rgba(33, 203, 243, 0.4)",
            "&:hover": {
              background: "linear-gradient(to right, #21cbf3, #2196f3)",
            },
          }}
        >
          🔒 RESET PASSWORD
        </Button>
      </Box>
    </Box>
  );
};

export default ResetPassword;
