// src/pages/FAQ.jsx
import React from "react";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Container } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpIcon from "@mui/icons-material/Help";
import Footer from "../Footer/Footer";
import TopBar from "../TopBar/TopBar";
const gold = "#FFD600";

const faqList = [
  {
    q: "How do I book a photographer?",
    a: "Simply search for your event or location, browse available photographers, and click 'Book Now' on their profile.",
  },
  {
    q: "How are photographers rated?",
    a: "Clients can rate and review photographers after each completed event. Ratings appear on photographer profiles.",
  },
  {
    q: "Can I contact photographers before booking?",
    a: "Yes, you can send direct messages to photographers from their profile page.",
  },
  {
    q: "Is there a booking fee?",
    a: "No, using EventClick to connect with photographers is free. Payment terms are set by individual photographers.",
  },
  {
    q: "How do I become a listed photographer?",
    a: "Click 'Join as Photographer' and follow the steps to create your portfolio and verify your account.",
  },
];

const FAQ = () => (
  <>
     <TopBar />
    <Box
      sx={{
        background: "linear-gradient(120deg, #191919 80%, #FFD60011 100%)",
        minHeight: "100vh",
        py: { xs: 7, md: 10 },
        color: "#eee",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Container maxWidth="md">
        <Box textAlign="center" mb={5}>
          <HelpIcon sx={{ fontSize: 55, color: gold, mb: 1 }} />
          <Typography variant="h3" fontWeight={800} color={gold} mb={2}>
            Frequently Asked Questions
          </Typography>
        </Box>
        {faqList.map(({ q, a }, i) => (
          <Accordion
            key={i}
            sx={{
              background: "#212121",
              color: "#eee",
              mb: 2,
              boxShadow: "0 2px 12px #FFD60022",
              borderRadius: 3,
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: gold }} />}>
              <Typography sx={{ color: gold, fontWeight: 600 }}>{q}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: "#ccc" }}>{a}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Box>
    <Footer />
  </>
);

export default FAQ;
