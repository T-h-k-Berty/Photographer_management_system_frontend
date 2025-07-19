// src/pages/HelpSupport.jsx
import React from "react";
import { Box, Typography, Container, List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import EmailIcon from "@mui/icons-material/Email";
import InfoIcon from "@mui/icons-material/Info";
import PhoneIcon from "@mui/icons-material/Phone";
import Footer from "../Footer/Footer";
import TopBar from "../TopBar/TopBar";
const gold = "#FFD600";

const HelpSupport = () => (
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
      <Container maxWidth="sm">
        <Box textAlign="center" mb={4}>
          <SupportAgentIcon sx={{ fontSize: 55, color: gold, mb: 2 }} />
          <Typography variant="h3" fontWeight={800} color={gold} mb={2}>
            Help & Support
          </Typography>
          <Typography variant="h6" sx={{ color: "#ccc", mb: 2 }}>
            Need help? Our support team is here for you 24/7.
          </Typography>
        </Box>
        <Divider sx={{ borderColor: "#FFD60033", mb: 3 }} />
        <List>
          <ListItem>
            <ListItemIcon>
              <EmailIcon sx={{ color: gold }} />
            </ListItemIcon>
            <ListItemText
              primary="support@eventclick.lk"
              secondary="Email us anytime. We respond within 24 hours."
              primaryTypographyProps={{ color: "#eee" }}
              secondaryTypographyProps={{ color: "#ccc" }}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <PhoneIcon sx={{ color: gold }} />
            </ListItemIcon>
            <ListItemText
              primary="+94 77 069 2832"
              secondary="Call us Monday – Friday, 8:30AM – 5:00PM"
              primaryTypographyProps={{ color: "#eee" }}
              secondaryTypographyProps={{ color: "#ccc" }}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <InfoIcon sx={{ color: gold }} />
            </ListItemIcon>
            <ListItemText
              primary="Knowledge Base"
              secondary="Browse FAQs, guides, and tips in our online Help Center."
              primaryTypographyProps={{ color: "#eee" }}
              secondaryTypographyProps={{ color: "#ccc" }}
            />
          </ListItem>
        </List>
      </Container>
    </Box>
    <Footer />
  </>
);

export default HelpSupport;
