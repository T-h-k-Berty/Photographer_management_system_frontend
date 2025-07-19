import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../Footer/Footer";
import {
  Box,
  Typography,
  Grid,
  Avatar,
  Card,
  Paper,
  Divider,
  Zoom,
  IconButton,
  Switch,
  FormControlLabel,
  Rating,
  Button,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  Slide,
  Tooltip as MuiTooltip,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useParams, useNavigate } from "react-router-dom";
import TopBar from "../TopBar/TopBar";
import StarIcon from "@mui/icons-material/Star";
import RedeemIcon from "@mui/icons-material/Redeem";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import dayjs from "dayjs";

// Social Media Icons
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const socialLinksConfig = [
  {
    field: "facebook",
    Icon: FacebookIcon,
    color: "#1877f3",
    tooltip: "Facebook",
    baseUrl: "", // Will use whatever the backend gives (should be full URL)
  },
  {
    field: "instagram",
    Icon: InstagramIcon,
    color: "#e1306c",
    tooltip: "Instagram",
    baseUrl: "",
  },
  {
    field: "twitter",
    Icon: TwitterIcon,
    color: "#1da1f2",
    tooltip: "Twitter",
    baseUrl: "",
  },
  {
    field: "whatsapp",
    Icon: WhatsAppIcon,
    color: "#25d366",
    tooltip: "WhatsApp",
    baseUrl: "",
  },
];

const PhotographerPortfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch portfolio
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

  // Fetch events for calendar
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (!portfolio?.userId) return;
        const res = await axios.get(
          `http://localhost:5000/api/events/user/${portfolio.userId}`
        );
        setEvents(res.data || []);
      } catch {
        setEvents([]);
      }
    };
    if (portfolio?.userId) fetchEvents();
  }, [portfolio]);

  const handleRatingSubmit = async () => {
    try {
      await axios.post(`http://localhost:5000/api/users/rate/${portfolio.userId}`, {
        rating: userRating,
      });
      setRatingSubmitted(true);

      // Refresh
      const res = await axios.get(`http://localhost:5000/api/portfolios/user/${id}`);
      setPortfolio(res.data);
    } catch (error) {
      console.error("Failed to submit rating", error);
    }
  };

  // Download image with watermark
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
      ctx.fillText(`${watermarkText} ©`, canvas.width / 2, canvas.height - 30);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/jpeg");
      a.download = "gallery-photo.jpg";
      a.click();
    };
  };

  // Calendar helpers
  const busyDatesSet = new Set(events.map(ev => ev.date));
  const tileDisabled = ({ date, view }) => {
    if (view !== "month") return false;
    const d = dayjs(date).format("YYYY-MM-DD");
    return busyDatesSet.has(d);
  };
  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;
    const d = dayjs(date).format("YYYY-MM-DD");
    if (busyDatesSet.has(d)) {
      return (
        <MuiTooltip title="Photographer is not available" arrow>
          <InfoOutlinedIcon sx={{ color: "#888", fontSize: 16, mt: 0.3, ml: 0.2 }} />
        </MuiTooltip>
      );
    }
    return null;
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

  // --- Social Links Render Helper
  const renderSocialLinks = () => {
    // Collect only available (non-empty) links
    const socialLinks = socialLinksConfig
      .map(({ field, Icon, color, tooltip, baseUrl }) => {
        const value = portfolio[field];
        if (value && typeof value === "string" && value.trim().length > 0) {
          let link = value.trim();
          // Add protocol if missing (e.g. for WhatsApp numbers)
          if (field === "whatsapp" && !link.startsWith("http")) {
            link = `https://wa.me/${link.replace(/[^0-9]/g, "")}`;
          } else if (!link.startsWith("http")) {
            link = "https://" + link;
          }
          return { Icon, color, tooltip, link };
        }
        return null;
      })
      .filter(Boolean);

    if (socialLinks.length === 0) return null;

    return (
      <Box mt={2} display="flex" justifyContent="center" gap={3}>
        {socialLinks.map(({ Icon, color, tooltip, link }, idx) => (
          <MuiTooltip title={tooltip} key={idx}>
            <IconButton
              component="a"
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: color,
                border: `2px solid ${color}44`,
                backgroundColor: darkMode ? "#232323" : "#fff",
                boxShadow: "0 2px 10px 0 #0002",
                transition: "background 0.2s, transform 0.2s",
                "&:hover": {
                  backgroundColor: color + "11",
                  transform: "scale(1.13)",
                },
                mx: 0.5,
                width: 54,
                height: 54,
              }}
            >
              <Icon sx={{ fontSize: 34 }} />
            </IconButton>
          </MuiTooltip>
        ))}
      </Box>
    );
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

                  {/* ⭐ Rating Controls */}
                  <Box mt={1}>
                    {!ratingSubmitted ? (
                      <>
                        <Rating
                          value={userRating}
                          onChange={(e, newValue) => setUserRating(newValue)}
                          precision={0.5}
                          sx={{
                            "& .MuiRating-iconFilled": { color: "#fdd835" },
                            "& .MuiRating-iconEmpty": { color: theme.textSecondary },
                          }}
                        />
                        <Button
                          startIcon={<StarIcon />}
                          onClick={handleRatingSubmit}
                          disabled={userRating === 0}
                          sx={{
                            mt: 1,
                            px: 3,
                            py: 1,
                            fontWeight: "bold",
                            borderRadius: "30px",
                            background: "linear-gradient(135deg, #fdd835, #ff6f00)",
                            color: "#000",
                            "&:hover": {
                              background: "linear-gradient(135deg, #fff176, #f57f17)",
                              transform: "translateY(-1px)",
                            },
                          }}
                        >
                          Submit Rating
                        </Button>
                      </>
                    ) : (
                      <Typography sx={{ mt: 1, color: "#4caf50" }}>Thank you for rating!</Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>

              {/* 🎯 Tags & Locations */}
              <Box mt={1} textAlign="center">
                <Box display="inline-flex" flexWrap="wrap" gap={1} justifyContent="center">
                  {portfolio.selectedEvents?.map((event, i) => (
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
                  {portfolio.locations?.map((loc, i) => (
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

              {/* ===== Social Media Icons Section ===== */}
              {renderSocialLinks()}
              {/* ===== End Social Section ===== */}

            </Box>
          </Paper>
        </Zoom>

        {/* ==== Floating Buttons ==== */}
        {/* Booking Button (Above Calendar Fab) */}
        <Box
          sx={{
            position: "fixed",
            bottom: { xs: 94, md: 120 },
            right: { xs: 20, md: 40 },
            zIndex: 2100,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <MuiTooltip title="Book This Photographer" placement="left" arrow>
            <Fab
              color="warning"
              onClick={() => navigate(`/Client/BookingForm/${portfolio.userId}`)}
              sx={{
                mb: 2,
                width: 68,
                height: 68,
                background: "radial-gradient(circle at 40% 40%, #ffd600 65%, #fffde7 100%)",
                color: "#222",
                boxShadow: "0 8px 32px 2px rgba(255,214,0,0.25)",
                border: "3px solid #ffd600",
                transition: "transform 0.18s cubic-bezier(.42,2,.57,.73)",
                animation: "bounceGlow 1.8s infinite alternate",
                "&:hover": {
                  background: "radial-gradient(circle at 40% 40%, #fffde7 70%, #ffd600 100%)",
                  color: "#ff6f00",
                  transform: "scale(1.08) rotate(-6deg)",
                  boxShadow: "0 10px 36px 3px #ffd60099",
                },
              }}
            >
              <BookOnlineIcon sx={{ fontSize: 40 }} />
            </Fab>
          </MuiTooltip>

          {/* Calendar Button */}
          <MuiTooltip title="Photographer's Availability" placement="left" arrow>
            <Fab
              color="warning"
              aria-label="photographer-availability"
              sx={{
                width: 56,
                height: 56,
                boxShadow: 5,
                background: darkMode ? "#232323" : "#fffde7",
                color: darkMode ? "#FFD600" : "#ff6f00",
                transition: "all 0.2s",
                "&:hover": {
                  background: darkMode ? "#FFD600" : "#fff176",
                  color: "#232323",
                },
              }}
              onClick={() => setCalendarOpen(true)}
            >
              <CalendarMonthIcon fontSize="large" />
            </Fab>
          </MuiTooltip>
        </Box>
        {/* ==== End Floating Buttons ==== */}

        {/* Modal Dialog for Calendar */}
        <Dialog
          open={calendarOpen}
          onClose={() => setCalendarOpen(false)}
          fullWidth
          maxWidth="xs"
          TransitionComponent={Slide}
          TransitionProps={{ direction: "up" }}
          PaperProps={{
            sx: {
              borderRadius: 4,
              background: darkMode ? "#232323" : "#fffdeee7",
              color: darkMode ? "#fff" : "#222",
              boxShadow: 10,
              px: 2,
              pt: 2,
              pb: 3,
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: "bold", color: darkMode ? "#FFD600" : "#ff9800" }}>
            📆 Photographer's Availability
          </DialogTitle>
          <DialogContent>
            <Typography
              align="center"
              variant="body2"
              sx={{ mb: 2, color: darkMode ? "#bbb" : "#333" }}
            >
              Gray days mean the photographer is <b>not available</b>.
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Calendar
                tileDisabled={tileDisabled}
                tileContent={tileContent}
                prev2Label={null}
                next2Label={null}
                minDetail="month"
                showNeighboringMonth={false}
                style={{
                  borderRadius: 12,
                  background: darkMode ? "#1a1a1a" : "#fff",
                }}
              />
            </Box>
          </DialogContent>
        </Dialog>

        {/* Masterpiece Gallery */}
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
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 4,
                mb: 8,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  maxWidth: 1200,
                  width: "100%",
                  backgroundColor: darkMode ? "#1a1a1a" : "#f5f5f5",
                  borderRadius: 4,
                  p: 2,
                  boxShadow: `0 8px 20px ${theme.shadow}`,
                }}
              >
                {/* 🎞️ Left: Event Type + Description */}
                <Box
                  sx={{
                    flex: "1 1 260px",
                    minWidth: 260,
                    maxWidth: 300,
                    backgroundColor: darkMode ? "#2a2a2a" : "#ffffff",
                    borderRadius: 3,
                    p: 2.5,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    boxShadow: "inset 0 0 10px rgba(0,0,0,0.1)",
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{
                      color: darkMode ? "#ffffff" : "#000000",
                      mb: 1.5,
                    }}
                  >
                    {gallery.eventType.charAt(0).toUpperCase() + gallery.eventType.slice(1)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: darkMode ? "#dddddd" : "#333",
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {gallery.description}
                  </Typography>
                </Box>

                {/* 🖼️ Right: 3 Fixed-Size Images */}
                {[gallery.photo1, gallery.photo2, gallery.photo3].filter(Boolean).map((photo, i) => (
                  <Box
                    key={i}
                    sx={{
                      flex: "1 1 220px",
                      minWidth: 220,
                      maxWidth: 250,
                      height: 300,
                      borderRadius: 3,
                      overflow: "hidden",
                      position: "relative",
                      backgroundColor: "#000",
                      boxShadow: `0 6px 16px ${theme.shadow}`,
                    }}
                  >
                    <Box
                      component="img"
                      src={`http://localhost:5000/uploads/${photo}`}
                      alt={`Gallery ${index + 1} - Photo ${i + 1}`}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    {/* ⬇️ Download Icon */}
                    <IconButton
                      onClick={() =>
                        downloadImageWithWatermark(
                          `http://localhost:5000/uploads/${photo}`,
                          portfolio.photographerName
                        )
                      }
                      sx={{
                        position: "absolute",
                        bottom: 10,
                        right: 10,
                        color: "#fff",
                        backgroundColor: "rgba(0,0,0,0.4)",
                        "&:hover": {
                          backgroundColor: "rgba(0,0,0,0.7)",
                        },
                      }}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Service Packages */}
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
          <Box display="flex" justifyContent="center">
            <Grid
              container
              spacing={4}
              sx={{
                maxWidth: 1200,
                width: "100%",
                justifyContent: "center",
              }}
            >
              {portfolio.Packages?.map((pkg, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Card
                    sx={{
                      width: 320,
                      minHeight: 360,
                      background: `linear-gradient(135deg, ${darkMode ? "#212121" : "#fff"}, ${darkMode ? "#333" : "#f9f9f9"})`,
                      color: theme.cardText,
                      borderRadius: "20px",
                      border: `2px solid ${darkMode ? "#fdd835" : "#ff9800"}`,
                      boxShadow: `0 12px 30px ${theme.shadow}`,
                      p: 3,
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: `0 16px 40px ${theme.shadow}`,
                      },
                    }}
                  >
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
                      sx={{ color: darkMode ? "#ffe082" : "#ff6f00", mt: 3 }}
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
        </Box>
      </Box>
      {/* Add Keyframes for Bounce/Glow Animation */}
      <style>
        {`
          @keyframes bounceGlow {
            0%   { transform: scale(1) rotate(0deg); box-shadow: 0 0 0 0 #ffd60055, 0 8px 32px 2px #ffd60033; }
            50%  { transform: scale(1.12) rotate(-8deg); box-shadow: 0 0 30px 7px #ffd60066, 0 8px 38px 7px #ffd60044; }
            100% { transform: scale(1) rotate(0deg); box-shadow: 0 0 0 0 #ffd60044, 0 8px 32px 2px #ffd60033; }
          }
        `}
      </style>
      <Footer />
    </>
  );
};

export default PhotographerPortfolio;
