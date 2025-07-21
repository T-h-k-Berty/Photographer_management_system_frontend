import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Rating,
  Chip,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../Footer/Footer";

const PopularPhotographers = () => {
  const [photographers, setPhotographers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhotographers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/photographers/with-portfolio");
        const sorted = res.data.sort((a, b) => b.rating - a.rating);
        setPhotographers(sorted);
        setFiltered(sorted);
      } catch (error) {
        console.error("Error fetching photographers:", error);
      }
    };
    fetchPhotographers();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(photographers);
      return;
    }
    const term = search.trim().toLowerCase();
    const data = photographers.filter((p) => {
      return (
        (p.name && p.name.toLowerCase().includes(term)) ||
        (p.shopName && p.shopName.toLowerCase().includes(term)) ||
        (Array.isArray(p.locations) && p.locations.some((loc) => loc.toLowerCase().includes(term))) ||
        (Array.isArray(p.eventTypes) && p.eventTypes.some((ev) => ev.toLowerCase().includes(term)))
      );
    });
    setFiltered(data);
  }, [search, photographers]);

  const handleRatingSubmit = async (photographerId, newRating) => {
    try {
      await axios.post(`http://localhost:5000/api/users/rate/${photographerId}`, { rating: newRating });
      const res = await axios.get("http://localhost:5000/api/users/photographers/with-portfolio");
      const sorted = res.data.sort((a, b) => b.rating - a.rating);
      setPhotographers(sorted);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const handleCardClick = (photographer) => {
    navigate(`/photographer/portfolio/${photographer.id}`);
  };

  const getProfilePictureUrl = (profilePicture) => {
    if (!profilePicture) {
      return "https://via.placeholder.com/300x300.png?text=No+Image";
    }
    const correctedPath = profilePicture.replace(/\\/g, "/");
    return `http://localhost:5000/${correctedPath}`;
  };

  const getMedal = (index) => {
    if (index < 5) return { label: "Gold Medalist", icon: "🥇", color: "#FFD700" };
    if (index < 10) return { label: "Silver Medalist", icon: "🥈", color: "#C0C0C0" };
    return { label: "Photographer", icon: "🎖️", color: "#999" };
  };

  return (
    <>
      <Box
        sx={{
          textAlign: "center",
          background: "linear-gradient(145deg, #111, #1c1c1c)",
          py: 6,
          color: "white",
          fontFamily: "'Poppins', sans-serif",
          minHeight: "100vh",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            mb: 5,
            letterSpacing: "2px",
            color: "#ffffff",
            textTransform: "uppercase",
          }}
        >
          Popular Photographers
        </Typography>

        
        <Box sx={{ maxWidth: 420, margin: "0 auto 36px auto" }}>
          <TextField
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, shop, location, or event type"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#fff" }} />
                </InputAdornment>
              ),
              style: { color: "white" },
            }}
            sx={{
              background: "#232323",
              borderRadius: 2,
              input: { color: "white" },
              label: { color: "#aaa" },
            }}
            size="small"
          />
        </Box>

    
        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="stretch"
          sx={{ maxWidth: "1300px", margin: "0 auto", px: 2 }}
        >
          {filtered.length === 0 && (
            <Typography variant="h6" color="gray" sx={{ width: "100%", mt: 6 }}>
              No photographers found matching your search.
            </Typography>
          )}
          {filtered.map((photographer, index) => {
            const medal = getMedal(index);
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={photographer.id}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: "24px",
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(8px)",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
                    overflow: "hidden",
                    transition: "transform 0.4s, box-shadow 0.4s",
                    "&:hover": {
                      transform: "scale(1.06)",
                      boxShadow: "0 12px 28px rgba(0, 0, 0, 0.7)",
                    },
                    cursor: "pointer",
                    border: `2px solid ${medal.color}`,
                    position: "relative",
                  }}
                  onClick={() => handleCardClick(photographer)}
                >
                  <CardMedia
                    component="img"
                    height="220"
                    image={getProfilePictureUrl(photographer.profilePicture)}
                    alt={photographer.name || "Photographer"}
                    sx={{
                      objectFit: "cover",
                      filter: "brightness(0.85)",
                      transition: "filter 0.3s",
                      "&:hover": { filter: "brightness(1)" },
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/300x300.png?text=No+Image";
                    }}
                  />

                  <CardContent sx={{ textAlign: "center", p: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        textTransform: "uppercase",
                        color: "#bbb",
                        mb: 1,
                      }}
                    >
                      Photographer
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        color: "#ffffff",
                        mb: 1,
                        fontSize: "1.3rem",
                      }}
                    >
                      {photographer.name}
                    </Typography>

                    <Rating
                      value={photographer.rating}
                      precision={0.5}
                      onChange={(e, newValue) =>
                        handleRatingSubmit(photographer.id, newValue)
                      }
                      sx={{ mt: 1, color: "#fdd835" }}
                    />
                    <Typography variant="caption" sx={{ color: "#ccc", mt: 1 }}>
                      {photographer.rating?.toFixed(1) ?? "0.0"} / 5 ({photographer.ratingCount ?? 0} ratings)
                    </Typography>

                    <Chip
                      label={`${medal.icon} ${medal.label}`}
                      sx={{
                        mt: 2,
                        backgroundColor: medal.color,
                        color: "#000",
                        fontWeight: "bold",
                        fontSize: "0.8rem",
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
      <Footer />
    </>
  );
};

export default PopularPhotographers;
