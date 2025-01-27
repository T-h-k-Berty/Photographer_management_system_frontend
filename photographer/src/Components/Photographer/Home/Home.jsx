import React from "react";
import { Box, Typography, Grid, Button, Container } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import "bootstrap/dist/css/bootstrap.min.css";
import backgroundImg from "../Home/home.jpg";
import TopBar from "../TopBar/TopBar";

const Home = () => {
  return (
    <>
      {/* Top Bar */}
      <TopBar />

      {/* Main Content */}
      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          color: "white",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {/* Darkened Left Side Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: "50%",
            background: "rgba(0, 0, 0, 0.7)",
          }}
        ></Box>

        <Container maxWidth="lg">
          <Grid container alignItems="center" justifyContent="flex-start" spacing={4}>
            {/* Left Section - Quote */}
            <Grid item xs={12} md={6} sx={{ zIndex: 1, display: "flex", alignItems: "center" }}>
              <Box px={{ xs: 2, md: 4 }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 700,
                    lineHeight: 1.2,
                    textAlign: "left",
                    color: "white",
                    fontSize: {
                      xs: "1.5rem", // Small screens
                      sm: "2rem",   // Medium screens
                      md: "3rem",   // Large screens
                      lg: "4rem",   // Extra large screens
                    },
                  }}
                >
                  “ Capture Every
                  <br /> Moment with the
                  <br /> Perfect Photographer ”
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Sort By Section */}
        <Box
          sx={{
            position: "absolute",
            bottom: 20,
            right: 20,
            backgroundColor: "white",
            borderRadius: "30px",
            boxShadow: "0 8px 12px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            px: 2,
            py: 0.5,
          }}
        >
          <Button
            variant="text"
            endIcon={<ArrowDropDownIcon />}
            sx={{
              color: "black",
              fontWeight: "bold",
              textTransform: "capitalize",
              fontSize: "1rem",
            }}
          >
            Sort By
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Home;
