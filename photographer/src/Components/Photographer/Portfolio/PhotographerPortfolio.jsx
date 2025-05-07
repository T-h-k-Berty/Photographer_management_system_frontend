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
  Zoom,
  IconButton,
  Switch,
  FormControlLabel,
  Rating,
  Button,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { useParams } from "react-router-dom";
import TopBar from "../TopBar/TopBar";
import StarIcon from "@mui/icons-material/Star";
import RedeemIcon from "@mui/icons-material/Redeem"; // 📦 Add this to your imports


const PhotographerPortfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/portfolios/user/${id}`);
        setPortfolio(res.data);
      } catch (err) {
        console.error("Failed to fetch portfolio", err);
      }
    };
    fetchPortfolio();
  }, [id]);

  const handleRatingSubmit = async () => {
    try {
      await axios.post(`http://localhost:5000/api/users/rate/${portfolio.userId}`, {
        rating: userRating,
      });
      setRatingSubmitted(true);

      const res = await axios.get(`http://localhost:5000/api/portfolios/user/${id}`);
      setPortfolio(res.data);
    } catch (error) {
      console.error("Failed to submit rating", error);
    }
  };

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
  

  if (!portfolio)
    return <Typography sx={{ mt: 10, textAlign: "center" }}>Loading portfolio...</Typography>;

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

  return (
    <>
      <TopBar />
      <Box sx={{ pt: 12, backgroundColor: theme.background, color: theme.textPrimary, minHeight: "100vh", px: 4 }}>
        <FormControlLabel control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />} label="Dark Mode" sx={{ position: "absolute", top: 90, right: 30 }} />

        <Zoom in timeout={1000}>
          <Paper elevation={10} sx={{ borderRadius: 4, p: 6, textAlign: "center", maxWidth: 1100, mx: "auto", mt: 6, backgroundColor: theme.paper, boxShadow: `0 20px 50px ${theme.shadow}`, position: "relative" }}>
            <Box component="img" src={`http://localhost:5000/uploads/${portfolio.backgroundPicture}`} sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.05, zIndex: 0 }} />
            <Box sx={{ position: "relative", zIndex: 2 }}>
              <Avatar src={`http://localhost:5000/uploads/${portfolio.profilePicture}`} sx={{ width: 140, height: 140, mx: "auto", mb: 2, border: `4px solid ${theme.tagBg}`, boxShadow: `0 0 20px ${theme.shadow}` }} />
              <Typography
  variant="h4"
  fontWeight="bold"
  sx={{
    color: darkMode ? "#ffffff" : "#000",
    textShadow: darkMode ? "2px 2px 6px rgba(0,0,0,0.5)" : "none",
    fontSize: "2.2rem",
    mb: 1,
  }}
>
  {portfolio.shopName}
</Typography>

              <Typography variant="subtitle1" sx={{ color: theme.textSecondary }}>{portfolio.photographerName}</Typography>

              <Box mt={2} display="flex" flexDirection="column" alignItems="center">
  <Typography variant="body2" sx={{ color: theme.textSecondary, mb: 1 }}>
    Rating: {portfolio.User?.rating?.toFixed(1) || "0.0"} / 5 ({portfolio.User?.ratingCount || 0} ratings)
  </Typography>

  {!ratingSubmitted ? (
    <>
      <Rating
        value={userRating}
        onChange={(e, newValue) => setUserRating(newValue)}
        precision={0.5}
        sx={{
          mt: 1,
          "& .MuiRating-iconFilled": {
            color: "#fdd835", // bright yellow for better contrast
          },
          "& .MuiRating-iconEmpty": {
            color: theme.textSecondary,
          },
        }}
      />
      <Button
        variant="contained"
        startIcon={<StarIcon />}
        sx={{
          mt: 1.5,
          fontWeight: "bold",
          background: "linear-gradient(135deg, #ffca28, #f57f17)",
          color: "#000",
          px: 3,
          py: 1,
          borderRadius: "30px",
          boxShadow: darkMode
            ? "0 4px 15px rgba(255, 202, 40, 0.3)"
            : "0 4px 12px rgba(245, 127, 23, 0.3)",
          transition: "all 0.3s ease",
          "&:hover": {
            background: "linear-gradient(135deg, #fdd835, #ff6f00)",
            transform: "translateY(-2px)",
          },
          "&:disabled": {
            background: "#ccc",
            color: "#666",
            cursor: "not-allowed",
          },
        }}
        onClick={handleRatingSubmit}
        disabled={userRating === 0}
      >
        Submit Rating
      </Button>
    </>
  ) : (
    <Typography variant="body2" sx={{ mt: 1, color: "#4caf50" }}>
      Thank you for rating!
    </Typography>
  )}
</Box>


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


        <Box mt={12} py={5} textAlign="center" borderTop={`1px solid ${theme.border}`} color={theme.textSecondary}>
          <Typography variant="body2">© {new Date().getFullYear()} EventClick – Showcase. Inspire. Connect.</Typography>
        </Box>
      </Box>
    </>
  );
};

export default PhotographerPortfolio;
