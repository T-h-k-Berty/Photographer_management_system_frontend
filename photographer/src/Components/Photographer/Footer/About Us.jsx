// src/pages/AboutUs.jsx
import React from "react";
import { Box, Typography, Container, Divider, Grid } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PeopleIcon from "@mui/icons-material/People";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import Footer from "../Footer/Footer";
import TopBar from "../TopBar/TopBar";
const gold = "#FFD600";

const AboutUs = () => (
  <>
     <TopBar />
    <Box
      sx={{
        background: "linear-gradient(120deg, #181818 80%, #FFD60011 100%)",
        minHeight: "100vh",
        py: { xs: 7, md: 10 },
        color: "#eee",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Container maxWidth="md">
        <Box textAlign="center" mb={4}>
          <CameraAltIcon sx={{ fontSize: 65, color: gold, mb: 1 }} />
          <Typography variant="h3" fontWeight={800} color={gold} mb={1}>
            About EventClick
          </Typography>
          <Typography variant="h6" sx={{ color: "#ccc", mb: 2, fontWeight: 400 }}>
            Your Story, Our Lens – Find the Right Photographer for Every Occasion.
          </Typography>
        </Box>
        <Divider sx={{ mb: 4, borderColor: "#FFD60044" }} />
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box textAlign="center" px={2}>
              <PeopleIcon sx={{ fontSize: 50, color: gold, mb: 1 }} />
              <Typography variant="h6" color={gold} fontWeight={700}>
                Community Focused
              </Typography>
              <Typography sx={{ color: "#ccc", mt: 1 }}>
                We connect thousands of clients with passionate photographers, helping capture life’s most cherished moments across Sri Lanka.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box textAlign="center" px={2}>
              <EmojiEventsIcon sx={{ fontSize: 50, color: gold, mb: 1 }} />
              <Typography variant="h6" color={gold} fontWeight={700}>
                Quality & Trust
              </Typography>
              <Typography sx={{ color: "#ccc", mt: 1 }}>
                Our platform is built on trust, transparency, and a commitment to quality. We carefully verify every photographer on our site.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box textAlign="center" px={2}>
              <CameraAltIcon sx={{ fontSize: 50, color: gold, mb: 1 }} />
              <Typography variant="h6" color={gold} fontWeight={700}>
                For Every Occasion
              </Typography>
              <Typography sx={{ color: "#ccc", mt: 1 }}>
                From weddings and events to portraits and parties, we help you find the perfect photographer for every special occasion.
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ mt: 7, mb: 4, borderColor: "#FFD60044" }} />
        <Box textAlign="center" maxWidth={650} mx="auto">
          <Typography variant="body1" sx={{ color: "#FFD600", fontWeight: 600, mb: 1.2 }}>
            Join thousands who trust EventClick!
          </Typography>
          <Typography sx={{ color: "#aaa", mb: 2 }}>
            Whether you’re a photographer looking to grow your portfolio or a client searching for the perfect match, EventClick is here to help you capture unforgettable memories.
          </Typography>
        </Box>
      </Container>
    </Box>
    <Footer />
  </>
);
export default AboutUs;
