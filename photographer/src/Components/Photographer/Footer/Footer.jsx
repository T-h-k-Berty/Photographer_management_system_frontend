import React from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Divider,
  Link,
  Stack,
  useTheme,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

const gold = "#FFD600";

const footerLinks = [
  { label: "About Us", to: "/about" },
  { label: "FAQ", to: "/FAQ" },
  { label: "Help & Support", to: "/help" },
  { label: "Contact", to: "/contact" },
];

const exploreLinks = [
  { label: "Photographers", to: "#" },
  { label: "Events", to: "#" },
  { label: "Portfolio", to: "#" },
  { label: "Packages", to: "#" },
];

const socials = [
  { icon: <FacebookIcon />, to: "#", label: "Facebook" },
  { icon: <WhatsAppIcon />, to: "#", label: "WhatsApp" },
  { icon: <TwitterIcon />, to: "#", label: "Twitter" },
  { icon: <InstagramIcon />, to: "#", label: "Instagram" },
];

const Footer = () => (
  <Box
    sx={{
      background: `linear-gradient(120deg, #222 85%, ${gold}11 100%)`,
      color: "#f4f4f4",
      borderTopLeftRadius: { xs: "28px", md: "54px" },
      borderTopRightRadius: { xs: "28px", md: "54px" },
      px: { xs: 2, sm: 5, md: 9 },
      pt: { xs: 6, md: 7 },
      pb: 0,
      mt: { xs: 7, md: 10 },
      boxShadow: "0 -8px 38px 0 #000b",
      zIndex: 2,
      position: "relative",
    }}
  >
    <Grid container spacing={4} alignItems="flex-start" justifyContent="center">
      {/* Quick Links */}
      <Grid item xs={12} sm={6} md={3} lg={2}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: gold, mb: 1 }}>
          Quick Links
        </Typography>
        {footerLinks.map((l) => (
          <Link
            key={l.label}
            href={l.to}
            underline="none"
            sx={{
              color: "#eee",
              fontWeight: 500,
              fontSize: 15,
              display: "block",
              mb: 1.1,
              transition: "color 0.2s",
              "&:hover": { color: gold, textDecoration: "underline" },
            }}
          >
            {l.label}
          </Link>
        ))}
      </Grid>

      {/* Center: Brand & Paragraph */}
      <Grid
        item
        xs={12}
        md={6}
        lg={5}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: { xs: "flex-start", md: "center" },
          textAlign: { xs: "left", md: "center" },
          my: { xs: 3, md: 0 },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            letterSpacing: 1,
            color: gold,
            mb: 2,
            fontSize: { xs: "2rem", sm: "2.2rem", md: "2.4rem" },
          }}
        >
          EventClick
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#ccc",
            mb: 2.5,
            fontWeight: 400,
            lineHeight: 1.6,
            maxWidth: 530,
          }}
        >
          Your Story, Our Lens – Find the Right Photographer for Every Occasion.<br />
          <span style={{ color: gold, fontWeight: 700 }}>
            Join thousands who trust EventClick
          </span>{" "}
          to capture their unforgettable moments.
        </Typography>
        {/* Social Media */}
        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
          {socials.map(({ icon, to, label }) => (
            <IconButton
              key={label}
              component="a"
              href={to}
              target="_blank"
              rel="noopener"
              aria-label={label}
              sx={{
                border: `2.5px solid ${gold}`,
                bgcolor: "transparent",
                color: gold,
                borderRadius: "50%",
                p: 1.1,
                mx: 0.3,
                boxShadow: "0 1px 7px #FFD60022",
                transition: "all 0.22s",
                "&:hover": {
                  bgcolor: gold,
                  color: "#191919",
                  transform: "scale(1.15)",
                  boxShadow: "0 2px 14px #FFD60055",
                },
              }}
            >
              {icon}
            </IconButton>
          ))}
        </Stack>
      </Grid>

      {/* Explore */}
      <Grid item xs={12} sm={6} md={3} lg={2}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: gold, mb: 1 }}>
          Explore
        </Typography>
        {exploreLinks.map((l) => (
          <Link
            key={l.label}
            href={l.to}
            underline="none"
            sx={{
              color: "#eee",
              fontWeight: 500,
              fontSize: 15,
              display: "block",
              mb: 1.1,
              transition: "color 0.2s",
              "&:hover": { color: gold, textDecoration: "underline" },
            }}
          >
            {l.label}
          </Link>
        ))}
      </Grid>

      {/* Contact Us */}
      <Grid item xs={12} md={6} lg={3}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: gold, mb: 1 }}>
          Contact Us
        </Typography>
        <Box display="flex" alignItems="center" mb={1.2}>
          <LocationOnIcon sx={{ color: gold, mr: 1, fontSize: 23 }} />
          <Typography variant="body2" sx={{ color: "#ccc", fontSize: 16 }}>
            Colombo, Sri Lanka
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={1.2}>
          <EmailIcon sx={{ color: gold, mr: 1, fontSize: 23 }} />
          <Typography variant="body2" sx={{ color: "#ccc", fontSize: 16 }}>
            support@eventclick.lk
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <PhoneIcon sx={{ color: gold, mr: 1, fontSize: 23 }} />
          <Typography variant="body2" sx={{ color: "#ccc", fontSize: 16 }}>
            +94 77 069 2832
          </Typography>
        </Box>
      </Grid>
    </Grid>

    <Divider sx={{ borderColor: "#FFD60033", my: { xs: 3, md: 5 }, mx: -3 }} />

    {/* Bottom Bar */}
    <Box textAlign="center" pb={3} pt={1} fontSize={15} sx={{ color: "#aaa", letterSpacing: 0.5 }}>
      <span style={{ color: gold, fontWeight: 600 }}>
        © {new Date().getFullYear()} EventClick.
      </span>{" "}
      All rights reserved.
    </Box>
  </Box>
);

export default Footer;
