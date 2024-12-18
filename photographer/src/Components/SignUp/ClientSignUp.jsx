import React from "react";
import { Grid, Typography, Box, Button, TextField } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "bootstrap/dist/css/bootstrap.min.css";
import backgroundImg from "../SignUp/background.png";

const ClientSignUp = () => {
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
        {/* Back Button */}
        <Box mb={2}>
          <Button
            startIcon={<ArrowBackIcon />}
            variant="text"
            sx={{ color: "white", fontWeight: "bold" }}
            onClick={() => window.history.back()}
          >
            Back
          </Button>
        </Box>

        {/* Client Icon */}
        <Box textAlign="center" mb={3}>
          <PeopleIcon sx={{ fontSize: 80, color: "white" }} />
        </Box>

        {/* Form Fields */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Name
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter your name"
              InputProps={{
                sx: { backgroundColor: "#444", color: "white" },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Email
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter your email"
              InputProps={{
                sx: { backgroundColor: "#444", color: "white" },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Password
            </Typography>
            <TextField
              fullWidth
              type="password"
              variant="outlined"
              placeholder="Enter your password"
              InputProps={{
                sx: { backgroundColor: "#444", color: "white" },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Re-enter Password
            </Typography>
            <TextField
              fullWidth
              type="password"
              variant="outlined"
              placeholder="Re-enter your password"
              InputProps={{
                sx: { backgroundColor: "#444", color: "white" },
              }}
            />
          </Grid>

           <Grid item xs={12}>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        Profile Picture
                      </Typography>
                      <TextField
                        fullWidth
                        type="file"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          sx: { backgroundColor: "#444", color: "white", borderRadius: "5px" },
                        }}
                      />
                    </Grid>
        </Grid>

        {/* Create Account Button */}
        <Box textAlign="center" mt={3}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "white",
              color: "black",
              fontWeight: "bold",
              borderRadius: "30px",
              px: 5,
              py: 1,
              ":hover": { backgroundColor: "#ddd" },
            }}
          >
            Create Account
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ClientSignUp;
