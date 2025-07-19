// src/pages/Contact.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EmailIcon from "@mui/icons-material/Email";
import Footer from "../Footer/Footer";
import TopBar from "../TopBar/TopBar";
const gold = "#FFD600";

const initialState = { name: "", email: "", subject: "", message: "" };

const Contact = () => {
  const [fields, setFields] = useState(initialState);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  // Replace with your backend API call, e.g. EmailJS, Nodemailer endpoint, etc.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    setSent(false);

    try {
      // EXAMPLE: call your backend API endpoint
      // await axios.post('/api/contact', fields);
      await new Promise((r) => setTimeout(r, 1500)); // Simulate async send
      setSent(true);
      setFields(initialState);
    } catch (err) {
      setError("Failed to send. Please try again.");
    }
    setSending(false);
  };

  return (
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
        <Container maxWidth="sm">
          <Box textAlign="center" mb={4}>
            <EmailIcon sx={{ fontSize: 50, color: gold, mb: 1 }} />
            <Typography variant="h3" fontWeight={800} color={gold} mb={1}>
              Contact Us
            </Typography>
            <Typography variant="h6" sx={{ color: "#ccc", mb: 3 }}>
              Have a question or feedback? Send us a message!
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Your Name"
                  variant="outlined"
                  fullWidth
                  required
                  value={fields.name}
                  onChange={(e) => setFields({ ...fields, name: e.target.value })}
                  sx={{
                    "& label": { color: gold },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: gold },
                      "&:hover fieldset": { borderColor: gold },
                    },
                  }}
                  InputLabelProps={{ style: { color: gold } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Your Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  required
                  value={fields.email}
                  onChange={(e) => setFields({ ...fields, email: e.target.value })}
                  sx={{
                    "& label": { color: gold },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: gold },
                      "&:hover fieldset": { borderColor: gold },
                    },
                  }}
                  InputLabelProps={{ style: { color: gold } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Subject"
                  variant="outlined"
                  fullWidth
                  required
                  value={fields.subject}
                  onChange={(e) => setFields({ ...fields, subject: e.target.value })}
                  sx={{
                    "& label": { color: gold },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: gold },
                      "&:hover fieldset": { borderColor: gold },
                    },
                  }}
                  InputLabelProps={{ style: { color: gold } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Message"
                  variant="outlined"
                  fullWidth
                  required
                  multiline
                  rows={4}
                  value={fields.message}
                  onChange={(e) => setFields({ ...fields, message: e.target.value })}
                  sx={{
                    "& label": { color: gold },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: gold },
                      "&:hover fieldset": { borderColor: gold },
                    },
                  }}
                  InputLabelProps={{ style: { color: gold } }}
                />
              </Grid>
            </Grid>
            <Box textAlign="center" mt={3}>
              <Button
                type="submit"
                size="large"
                variant="contained"
                startIcon={sending ? <CircularProgress size={22} sx={{ color: "#222" }} /> : <SendIcon />}
                sx={{
                  px: 5,
                  background: `linear-gradient(90deg, #FFD600 60%, #FFF59D 100%)`,
                  color: "#222",
                  fontWeight: 700,
                  fontSize: 17,
                  boxShadow: "0 4px 18px #FFD60044",
                  borderRadius: 8,
                  "&:hover": { background: `linear-gradient(90deg, #FFF59D 60%, #FFD600 100%)` },
                }}
                disabled={sending}
              >
                {sending ? "Sending..." : "Send Message"}
              </Button>
            </Box>
            {sent && (
              <Alert severity="success" sx={{ mt: 3 }}>
                Message sent successfully! We'll reply as soon as possible.
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {error}
              </Alert>
            )}
          </form>
          <Box mt={5} textAlign="center" color={gold}>
            Or email us directly: support@eventclick.lk
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};
export default Contact;
