import React from "react";
import { Grid, Typography, Box, Button } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PeopleIcon from "@mui/icons-material/People";
import "bootstrap/dist/css/bootstrap.min.css";
import signupImage from "../SignUp/img.png";

const SignUp = () => {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#000" }}>
      {/* Background Image */}
      <Box
        sx={{
          backgroundImage: `url(${signupImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "300px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
            textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
          }}
        >
          Join Our Community
        </Typography>
      </Box>

      {/* Content Section */}
      <Grid container spacing={4} justifyContent="center" alignItems="center" mt={4}>
        {/* Photographers Section */}
        <Grid item xs={11} sm={5} md={4}>
          <Box
            sx={{
              backgroundColor: "#111",
              color: "white",
              borderRadius: "10px",
              textAlign: "center",
              py: 4,
              boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
            }}
          >
            <CameraAltIcon style={{ fontSize: "80px", marginBottom: "10px", color: "white" }} />
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
              Photographers
            </Typography>
            <Button a href="/PhotographerSignUp" variant="outlined" color="inherit" sx={{ px: 4, borderRadius: "20px" }}>
              Sign Up
            </Button>
          </Box>
        </Grid>

        {/* Clients Section */}
        <Grid item xs={11} sm={5} md={4}>
          <Box
            sx={{
              backgroundColor: "#111",
              color: "white",
              borderRadius: "10px",
              textAlign: "center",
              py: 4,
              boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
            }}
          >
            <PeopleIcon style={{ fontSize: "80px", marginBottom: "10px", color: "white" }} />
            <Typography  variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
              Clients
            </Typography>
            <Button a href="/ClientSignUp" variant="outlined" color="inherit" sx={{ px: 4, borderRadius: "20px" }}>
              Sign Up
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Login Link Section */}
      <Box textAlign="center" mt={4}>
        <Typography variant="body1" sx={{ color: "#aaa", fontSize: "1.1rem" }}>
          Have an Account?{' '}
          <a href="/login" style={{ color: "#1976d2", textDecoration: "none", fontWeight: "bold" }}>
            Login
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignUp;
