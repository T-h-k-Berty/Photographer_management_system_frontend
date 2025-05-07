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
import RedeemIcon from "@mui/icons-material/Redeem"; // 📦 Add this to your imports


const ViewPortfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser?.id) {
          console.error("No valid user found");
          return;
        }
  
        const res = await axios.get(`http://localhost:5000/api/portfolios/user/${storedUser.id}`);
        setPortfolio(res.data); // ✅ Now sets the correct portfolio
      } catch (err) {
        console.error("Failed to fetch portfolio", err);
      }
    };
  
    fetchPortfolio();
  }, []);
  
  

  const downloadImageWithWatermark = async (imageUrl, watermarkText) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
  
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
  
      // 🖋️ Elegant Gold Watermark Styling
      const fontSize = canvas.width * 0.035;
      ctx.font = `italic ${fontSize}px Georgia, serif`;
      ctx.fillStyle = "#FFD700"; // Gold
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.shadowBlur = 2;
  
      // ✨ Add watermark text
      ctx.fillText(`${watermarkText} ©`, canvas.width / 2, canvas.height - 30);
  
      // 🎯 Download logic
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/jpeg");
      a.download = "gallery-photo.jpg";
      a.click();
    };
  };
  

  if (!portfolio) return <Typography>Loading...</Typography>;

  const theme = {
    background: darkMode ? "#121212" : "#f4f4f4",
    paper: darkMode ? "#1e1e1e" : "#ffffff",
    textPrimary: darkMode ? "#e0e0e0" : "#333333",
    textSecondary: darkMode ? "#ccc" : "#666",
    tagBg: darkMode ? "#ffffff" : "#fdd835",
    tagColor: darkMode ? "#000" : "#000",
    cardBg: darkMode ? "#1f1f1f" : "#ffffff",
    cardText: darkMode ? "#eee" : "#333",
    border: darkMode ? "#333" : "#ddd",
    shadow: darkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)",
  };

  const getProfilePictureUrl = (profilePicture) => {
  if (!profilePicture) {
    return "https://via.placeholder.com/240"; // Default image
  }

  // Remove "uploads/" if already exists
  const filename = profilePicture.includes("uploads/")
    ? profilePicture.split("uploads/")[1]
    : profilePicture;

  return `http://localhost:5000/uploads/${filename}`;
};


return (
  <>
    <TopBar />
    <Box sx={{ pt: 12, backgroundColor: theme.background, color: theme.textPrimary, minHeight: "100vh", px: 4 }}>
      <FormControlLabel
        control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
        label="Dark Mode"
        sx={{ position: "absolute", top: 90, right: 30 }}
      />

<Zoom in timeout={1000}>
<Paper
  elevation={10}
  sx={{
    borderRadius: 4,
    p: 0,
    maxWidth: 1100,
    mx: "auto",
    mt: 6,
    backgroundColor: theme.paper,
    boxShadow: `0 20px 50px ${theme.shadow}`,
    overflow: "hidden",
    position: "relative",
  }}
>
  {/* 🔳 Background Photo as Top Half */}
  <Box
    component="img"
    src={`http://localhost:5000/uploads/${portfolio.backgroundPicture}`}
    sx={{
      width: "100%",
      height: "200px",
      objectFit: "cover",
      display: "block",
    }}
  />

  {/* Content section under background */}
  <Box sx={{ px: 4, pb: 5, pt: 2 }}>
    <Grid container spacing={3} alignItems="center">
      {/* 📸 Profile Picture */}
      <Grid item xs={12} md={3} textAlign="center" sx={{ mt: -10 }}>
        <Avatar
          src={`http://localhost:5000/uploads/${portfolio.profilePicture}`}
          sx={{
            width: 160,
            height: 160,
            border: `5px solid ${theme.background}`,
            boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
            mx: "auto",
          }}
        />
      </Grid>

      {/* 🔠 Text & Rating */}
      <Grid item xs={12} md={9} sx={{ textAlign: { xs: "center", md: "left" } }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            color: theme.textPrimary,
            textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
            mb: 0.5,
          }}
        >
          {portfolio.shopName}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: theme.textSecondary }}>
          {portfolio.photographerName}
        </Typography>
        <Typography variant="body2" sx={{ color: theme.textSecondary }}>
          Rating: {portfolio.User?.rating?.toFixed(1) || "0.0"} / 5 ({portfolio.User?.ratingCount || 0} ratings)
        </Typography>

      </Grid>
    </Grid>

    {/* 🎯 Tags & Locations */}
    <Box mt={1} textAlign="center">
      <Box display="inline-flex" flexWrap="wrap" gap={1} justifyContent="center">
        {portfolio.selectedEvents.map((event, i) => (
          <Box
            key={i}
            sx={{
              px: 2.5,
              py: 0.8,
              backgroundColor: theme.tagBg,
              borderRadius: "999px",
              color: theme.tagColor,
              fontWeight: 500,
              fontSize: "0.85rem",
            }}
          >
            {event}
          </Box>
        ))}
      </Box>

      <Typography
variant="body2"
sx={{
  mt: 2,
  fontSize: "1rem",
  fontWeight: 500,
  color: darkMode ? "#ffffff" : "#333333",
  textAlign: "center",
  letterSpacing: "0.5px",
  lineHeight: 1.6,
}}
>
{portfolio.locations.map((loc, i) => (
  <span key={i}>
    {loc}
    {i < portfolio.locations.length - 1 && <span style={{ margin: "0 8px", color: "#aaa" }}>•</span>}
  </span>
))}
</Typography>

    </Box>

    {/* 📝 Description */}
    <Divider sx={{ my: -1, borderColor: theme.border }} />
    <Box
sx={{
  mt: 3,
  display: "flex",
  justifyContent: "center",
  animation: "slideInRightToLeft 1s ease-out forwards",
}}
>
<Box
  sx={{
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    padding: "20px 30px",
    border: `1px solid ${darkMode ? "#555" : "#ccc"}`,
    maxWidth: 800,
    width: "100%",
    textAlign: "center",
    color: darkMode ? "#f4f4f4" : "#333",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    backdropFilter: "blur(4px)",
  }}
>
  <Typography
    variant="body1"
    sx={{
      fontSize: "1rem",
      lineHeight: 1.8,
      letterSpacing: "0.3px",
      fontWeight: 400,
    }}
  >
    {portfolio.description}
  </Typography>
</Box>
</Box>

  </Box>
</Paper>
</Zoom>

        {/* Gallery Section */}
        {/* Gallery Section - Grouped by Event Type */}
<Box mt={10}>
  <Typography
    variant="h4"
    fontWeight="bold"
    mb={4}
    textAlign="center"
    sx={{
      color: darkMode ? "#fdd835" : "#ff6f00",
      textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
      fontSize: "2.2rem",
      letterSpacing: "1px",
    }}
  >
    📸 Masterpiece Gallery
  </Typography>

  {portfolio.Galleries?.map((gallery, index) => (
    <Box key={index} mb={8}>
      {/* 🎨 Event Type Header */}
      <Typography
        variant="h5"
        fontWeight="bold"
        textAlign="left"
        sx={{
          color: darkMode ? "#ffd54f" : "#d84315",
          mb: 2,
          ml: 1,
          textTransform: "capitalize",
        }}
      >
        🎞️ {gallery.eventType}
      </Typography>

      <Grid container spacing={4}>
        {[gallery.photo1, gallery.photo2, gallery.photo3].filter(Boolean).map((photo, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Box
              sx={{
                position: "relative",
                borderRadius: 3,
                overflow: "hidden",
                backgroundColor: "#000",
                boxShadow: `0 12px 25px ${theme.shadow}`,
                transition: "transform 0.4s ease, box-shadow 0.4s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: `0 16px 40px ${theme.shadow}`,
                },
              }}
            >
              <Box
                component="img"
                src={`http://localhost:5000/uploads/${photo}`}
                alt={`Gallery ${index + 1} - Photo ${i + 1}`}
                sx={{
                  width: "100%",
                  height: "auto",
                  maxHeight: 400,
                  objectFit: "cover",
                  display: "block",
                }}
              />

              {/* Overlay Description */}
              <Box
                className="hoverContent"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  backgroundColor: "rgba(0,0,0,0.85)",
                  color: "#fff",
                  p: 2,
                  textAlign: "center",
                  transform: "translateY(100%)",
                  opacity: 0,
                  transition: "all 0.4s ease",
                  "&:hover": {
                    transform: "translateY(0%)",
                    opacity: 1,
                  },
                }}
              >
                <Typography variant="body2" sx={{ fontStyle: "italic", opacity: 0.9 }}>
                  {gallery.description}
                </Typography>
              </Box>

              {/* Download Button */}
              <IconButton
                onClick={() =>
                  downloadImageWithWatermark(`http://localhost:5000/uploads/${photo}`, portfolio.photographerName)
                }
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  color: "white",
                  backgroundColor: "rgba(0,0,0,0.4)",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.7)",
                  },
                }}
              >
                <DownloadIcon />
              </IconButton>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  ))}
</Box>



        {/* Package Section */}
        <Box mt={10}>
  <Typography
    variant="h4"
    fontWeight="bold"
    mb={4}
    textAlign="center"
    sx={{
      color: darkMode ? "#ffe082" : "#ff6f00",
      textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
    }}
  >
    🎁 Special Service Packages
  </Typography>

  <Grid container spacing={4}>
    {portfolio.Packages?.map((pkg, idx) => (
      <Grid item xs={12} sm={6} md={4} key={idx}>
        <Card
          sx={{
            background: `linear-gradient(135deg, ${darkMode ? "#212121" : "#fff"}, ${darkMode ? "#333" : "#f9f9f9"})`,
            color: theme.cardText,
            borderRadius: "20px",
            border: `2px solid ${darkMode ? "#fdd835" : "#ff9800"}`,
            boxShadow: `0 12px 30px ${theme.shadow}`,
            p: 3,
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            position: "relative",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: `0 16px 40px ${theme.shadow}`,
            },
          }}
        >
          {/* 🎀 Gift ribbon icon */}
          <RedeemIcon
            sx={{
              position: "absolute",
              top: -20,
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: darkMode ? "#fdd835" : "#ff9800",
              color: "#fff",
              borderRadius: "50%",
              padding: 1,
              fontSize: "2rem",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            }}
          />

          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            textAlign="center"
            sx={{
              color: darkMode ? "#ffe082" : "#ff6f00",
              mt: 3,
            }}
          >
            {pkg.title}
          </Typography>

          <Divider sx={{ my: 2, borderColor: theme.border }} />

          <Typography
            variant="body2"
            sx={{
              fontSize: "0.95rem",
              mb: 2,
              lineHeight: 1.6,
              textAlign: "center",
              color: theme.textSecondary,
            }}
          >
            {pkg.description}
          </Typography>

          <Typography
            variant="h6"
            align="center"
            sx={{
              backgroundColor: darkMode ? "#fdd835" : "#ff6f00",
              color: "#000",
              borderRadius: "30px",
              fontWeight: "bold",
              mt: 2,
              py: 1,
              px: 3,
              display: "inline-block",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }}
          >
            Rs.{" "}
            {parseFloat(pkg.price).toLocaleString("en-LK", {
              minimumFractionDigits: 2,
            })}
          </Typography>
        </Card>
      </Grid>
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
