// === ViewPortfolio.jsx ===
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Avatar,
  Card,
  CardContent,
  Paper,
  Divider,
  Slide,
  Fade,
  Zoom,
  IconButton,
  Switch,
  FormControlLabel
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import { useNavigate } from "react-router-dom";
import TopBar from "../TopBar/TopBar";

const ViewPortfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/portfolios?userId=${user.id}`);
        setPortfolio(res.data[0]);
      } catch (err) {
        console.error("Failed to fetch portfolio", err);
      }
    };
    fetchPortfolio();
  }, [user.id]);

  const downloadImageWithWatermark = async (imageUrl, watermarkText) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      ctx.font = `${canvas.width * 0.04}px Arial`;
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.textAlign = 'center';
      ctx.fillText(watermarkText + ' ©', canvas.width / 2, canvas.height - 30);

      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/jpeg');
      a.download = 'gallery-photo.jpg';
      a.click();
    };
  };

  if (!portfolio) return <Typography>Loading...</Typography>;

  const theme = {
    background: darkMode ? "#121212" : "#f4f4f4",
    paper: darkMode ? "#1e1e1e" : "#ffffff",
    textPrimary: darkMode ? "#e0e0e0" : "#333333",
    textSecondary: darkMode ? "#ccc" : "#666",
    tagBg: darkMode ? "#ffffff" : "#1976d2",
    tagColor: darkMode ? "#000" : "#fff",
    cardBg: darkMode ? "#1f1f1f" : "#ffffff",
    cardText: darkMode ? "#eee" : "#333",
    border: darkMode ? "#333" : "#ddd",
    shadow: darkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)",
  };

  return (
    <>
      <TopBar />
      <Box sx={{ pt: 12, backgroundColor: theme.background, color: theme.textPrimary, minHeight: "100vh", px: 4 }}>
        <FormControlLabel control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />} label="Dark Mode" sx={{ position: "absolute", top: 90, right: 30 }} />

        {/* Profile Section */}
        <Zoom in timeout={1000}>
          <Paper elevation={10} sx={{ borderRadius: 4, p: 6, textAlign: "center", maxWidth: 1100, mx: "auto", mt: 6, backgroundColor: theme.paper, boxShadow: `0 20px 50px ${theme.shadow}`, position: "relative" }}>
            <Box component="img" src={`http://localhost:5000/uploads/${portfolio.backgroundPicture}`} sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.05, zIndex: 0 }} />
            <Box sx={{ position: "relative", zIndex: 2 }}>
              <Avatar src={`http://localhost:5000/uploads/${portfolio.profilePicture}`} sx={{ width: 140, height: 140, mx: "auto", mb: 2, border: `4px solid ${theme.tagBg}`, boxShadow: `0 0 20px ${theme.shadow}` }} />
              <Typography variant="h4" fontWeight="bold">{portfolio.shopName}</Typography>
              <Typography variant="subtitle1" sx={{ color: theme.textSecondary }}>{portfolio.photographerName}</Typography>
              <Typography variant="body2" sx={{ mt: 1, color: theme.textSecondary, maxWidth: 800, mx: "auto" }}>{portfolio.photographerDescription}</Typography>
              <Box mt={2} display="flex" justifyContent="center" flexWrap="wrap" gap={1}>
                {portfolio.selectedEvents.map((event, i) => (
                  <Box key={i} sx={{ px: 2.5, py: 0.8, backgroundColor: theme.tagBg, borderRadius: "999px", color: theme.tagColor, fontWeight: 500, fontSize: "0.85rem" }}>{event}</Box>
                ))}
              </Box>
              <Typography variant="body2" sx={{ mt: 1, color: theme.textSecondary }}>{portfolio.locations.join(", ")}</Typography>
              <Divider sx={{ my: 3, borderColor: theme.border }} />
              <Typography variant="body1" sx={{ fontSize: "1rem", lineHeight: 1.8, maxWidth: 800, mx: "auto", color: theme.textSecondary }}>{portfolio.description}</Typography>
            </Box>
          </Paper>
        </Zoom>

        {/* Gallery Section */}
        <Box mt={10}>
          <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">Portfolio Gallery</Typography>
          <Grid container spacing={4}>
            {portfolio.Galleries?.flatMap((gallery, index) =>
              [gallery.photo1, gallery.photo2, gallery.photo3].filter(Boolean).map((photo, i) => (
                <Grid item xs={12} sm={6} md={4} key={`${index}-${i}`}>
                  <Box sx={{ position: "relative", overflow: "hidden", borderRadius: 3, boxShadow: `0 6px 20px ${theme.shadow}`, cursor: "pointer", '&:hover .hoverContent': { transform: 'translateY(0)', opacity: 1 } }}>
                    <Box component="img" src={`http://localhost:5000/uploads/${photo}`} alt={`Gallery ${index + 1} - Photo ${i + 1}`} sx={{ width: "100%", height: "auto", maxHeight: 350, objectFit: "contain", transition: "transform 0.3s ease", '&:hover': { transform: "scale(1.05)" } }} />
                    <IconButton onClick={() => downloadImageWithWatermark(`http://localhost:5000/uploads/${photo}`, portfolio.photographerName)} sx={{ position: 'absolute', top: 8, right: 8, color: 'white', zIndex: 2 }}><DownloadIcon /></IconButton>
                    <Box className="hoverContent" sx={{ position: "absolute", bottom: 0, left: 0, width: "100%", backgroundColor: "rgba(0,0,0,0.8)", color: "white", p: 2, textAlign: "center", transform: "translateY(100%)", opacity: 0, transition: "all 0.4s ease" }}>
                      <Typography variant="h6">{gallery.eventType}</Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>{gallery.description}</Typography>
                    </Box>
                  </Box>
                </Grid>
              ))
            )}
          </Grid>
        </Box>

        {/* Package Section */}
        <Box mt={10}>
          <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">Service Packages</Typography>
          <Grid container spacing={4}>
            {portfolio.Packages?.map((pkg, idx) => (
              <Fade key={idx} in timeout={800 + idx * 200}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={{ backgroundColor: theme.cardBg, color: theme.cardText, borderRadius: 3, boxShadow: `0 8px 20px ${theme.shadow}`, p: 3, height: "100%" }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>{pkg.title}</Typography>
                    <Typography variant="body2" sx={{ fontSize: "0.95rem", mb: 2, lineHeight: 1.6 }}>{pkg.description}</Typography>
                    <Divider sx={{ my: 1, borderColor: theme.border }} />
                    <Typography variant="h6" align="right" sx={{ color: theme.tagBg, fontWeight: "bold", fontSize: "1.1rem", mt: 2 }}>Rs. {parseFloat(pkg.price).toLocaleString("en-LK", { minimumFractionDigits: 2 })}</Typography>
                  </Card>
                </Grid>
              </Fade>
            ))}
          </Grid>
        </Box>

        {/* Footer */}
        <Box mt={12} py={5} textAlign="center" borderTop={`1px solid ${theme.border}`} color={theme.textSecondary}>
          <Typography variant="body2">© {new Date().getFullYear()} EventClick – Showcase. Inspire. Connect.</Typography>
        </Box>
      </Box>
    </>
  );
};

export default ViewPortfolio;
