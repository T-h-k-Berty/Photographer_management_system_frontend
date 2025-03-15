import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Grid, TextField, Button, Typography, Box, Alert } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import headerImage from "../Login/img-01.jpg";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", loginData, {
        headers: { "Content-Type": "application/json" },
      });

      const { token, user } = response.data;

      // ✅ Save token and user info in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setMessage(`Welcome, ${user.name}! Login successful.`);

      // ✅ Redirect user based on role after 2 seconds
      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/dashboard/admin");
        } else if (user.role === "photographer") {
          navigate("/PhotographerHome");
        } else {
          navigate("/PhotographerHome");
        }
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#000" }}>
      <Grid container alignItems="center" justifyContent="center" sx={{ minHeight: "100vh" }}>
        {/* Main Container */}
        <Grid item xs={11} sm={8} md={6} lg={5} sx={{ backgroundColor: "#000", color: "white", borderRadius: "10px" }}>
          {/* Header Section */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            pt={4}
            sx={{
              backgroundImage: `url(${headerImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backgroundBlendMode: "darken",
              height: "300px",
              borderRadius: "10px 10px 0 0",
              color: "white",
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: "bold", textAlign: "center", mt: 4 }}>
              Discover photography <br /> with us
            </Typography>
            <Button variant="contained" color="error" sx={{ borderRadius: "30px", px: 4, py: 1, mt: 3 }}>
              Discover
            </Button>
            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: "bold", textAlign: "center" }}>
              Find your perfect photographer !
            </Typography>
          </Box>

          {/* Login Form */}
          <Box px={4} component="form" onSubmit={handleLoginSubmit}>
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

            <Typography variant="body1" sx={{ mb: 1, color: "#aaa" }}>
              Email
            </Typography>
            <TextField
              fullWidth
              type="email"
              name="email"
              placeholder="example@gmail.com"
              variant="outlined"
              size="small"
              onChange={handleChange}
              sx={{ input: { backgroundColor: "#222", color: "white" }, mb: 2 }}
            />
            <Typography variant="body1" sx={{ mb: 1, color: "#aaa" }}>
              Password
            </Typography>
            <TextField
              fullWidth
              type="password"
              name="password"
              placeholder="**********"
              variant="outlined"
              size="small"
              onChange={handleChange}
              sx={{ input: { backgroundColor: "#222", color: "white" }, mb: 2 }}
            />

            <Box textAlign="center">
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ borderRadius: "30px", py: 1, mb: 2 }} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
              <Typography variant="body2" sx={{ color: "#aaa" }}>
                Don’t have an Account ? <a href="/SignUp" style={{ color: "#1976d2" }}>Sign up</a>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginPage;
