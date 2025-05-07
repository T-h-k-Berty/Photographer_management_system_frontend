import React from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#222",
        color: "#eee",
        borderTopLeftRadius: "40px",
        borderTopRightRadius: "40px",
        px: 5,
        pt: 6,
        pb: 2,
        mt: 8,
      }}
    >
      <div className="container">
        <Grid container spacing={4} justifyContent="space-between">
          {/* Logo & Description */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              EventClick
            </Typography>
            <Typography variant="body2" sx={{ color: "#bbb", mb: 2 }}>
              Your Story, Our Lens – Find the Right Photographer for Every Occasion. Join thousands who trust EventClick to capture their unforgettable moments.
            </Typography>
            <Box>
              <IconButton sx={{ color: "#fff", mr: 1 }}><FacebookIcon /></IconButton>
              <IconButton sx={{ color: "#fff", mr: 1 }}><WhatsAppIcon /></IconButton>
              <IconButton sx={{ color: "#fff", mr: 1 }}><TwitterIcon /></IconButton>
              <IconButton sx={{ color: "#fff" }}><InstagramIcon /></IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Quick Links
            </Typography>
            <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>About Us</Typography>
            <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>FAQ</Typography>
            <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>Help & Support</Typography>
            <Typography variant="body2" sx={{ color: "#ccc" }}>Contact</Typography>
          </Grid>

          {/* Explore */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Explore
            </Typography>
            <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>Photographers</Typography>
            <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>Events</Typography>
            <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>Portfolio</Typography>
            <Typography variant="body2" sx={{ color: "#ccc" }}>Packages</Typography>
          </Grid>

          {/* Contact Us */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Contact Us
            </Typography>
            <Box display="flex" alignItems="center" mb={1}>
              <LocationOnIcon sx={{ color: "#bbb", mr: 1 }} />
              <Typography variant="body2" sx={{ color: "#ccc" }}>
                Colombo, Sri Lanka
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <EmailIcon sx={{ color: "#bbb", mr: 1 }} />
              <Typography variant="body2" sx={{ color: "#ccc" }}>
                support@eventclick.lk
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <PhoneIcon sx={{ color: "#bbb", mr: 1 }} />
              <Typography variant="body2" sx={{ color: "#ccc" }}>
                +94 77 123 4567
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Divider */}
        <Divider sx={{ borderColor: "#444", my: 4 }} />

        {/* Bottom text */}
        <Box textAlign="center" pb={2}>
          <Typography variant="body2" sx={{ color: "#888" }}>
            © {new Date().getFullYear()} EventClick. All rights reserved.
          </Typography>
        </Box>
      </div>
    </Box>
  );
};

export default Footer;
