import React from "react";
import { Grid, TextField, Button, Typography, Box } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import headerImage from "../Login/img-01.jpg";

const LoginPage = () => {
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
            <Button
              variant="contained"
              color="error"
              sx={{ borderRadius: "30px", px: 4, py: 1, mt: 3 }}
            >
              Discover
            </Button>
            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: "bold", textAlign: "center" }}>
              Find your perfect photographer !
            </Typography>
          </Box>

          {/* Login Form */}
          <Box px={4}>
            <Typography variant="body1" sx={{ mb: 1, color: "#aaa" }}>
              Email
            </Typography>
            <TextField
              fullWidth
              placeholder="example@gmail.com"
              variant="outlined"
              size="small"
              sx={{ input: { backgroundColor: "#222", color: "white" }, mb: 2 }}
            />
            <Typography variant="body1" sx={{ mb: 1, color: "#aaa" }}>
              Password
            </Typography>
            <TextField
              fullWidth
              type="password"
              placeholder="**********"
              variant="outlined"
              size="small"
              sx={{ input: { backgroundColor: "#222", color: "white" }, mb: 2 }}
            />
            <Box textAlign="center">
              <Button variant="contained" color="primary" fullWidth sx={{ borderRadius: "30px", py: 1, mb: 2 }}>
                Login
              </Button>
              <Typography variant="body2" sx={{ color: "#aaa" }}>
                Don’t have an Account ? <a href="#" style={{ color: "#1976d2" }}>Sign up</a>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginPage;
