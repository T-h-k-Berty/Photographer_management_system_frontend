import React from "react";
import { Box, Card, CardMedia, CardContent, Typography, Grid, Rating } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";

// Import local images
import image1 from "../Popular_Phptographer/Img-03.jpg"; // Replace with your image file
import image2 from "../Popular_Phptographer/Img-02.jpg";   // Replace with your image file
import image3 from "../Popular_Phptographer/Img-01.jpg"; // Replace with your image file

const photographers = [
  {
    name: "Oliver James",
    category: "Nature Photography",
    image: image1,
    stars: 5,
    description: "Capturing breathtaking landscapes and wildlife.",
  },
  {
    name: "Maya Levine",
    category: "Wedding Photography",
    image: image2,
    stars: 4,
    description: "Creating timeless memories of your special day.",
  },
  {
    name: "Sophia Kim",
    category: "Event Photography",
    image: image3,
    stars: 5,
    description: "Documenting unforgettable moments and celebrations.",
  },
];

const PopularPhotographers = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        backgroundColor: "#101010",
        py: 6,
        color: "white",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          mb: 5,
          letterSpacing: "2px",
          color: "white",
          textTransform: "uppercase",
        }}
      >
        Popular Photographers
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {photographers.map((photographer, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                maxWidth: 350,
                backgroundColor: "#1a1a1a",
                borderRadius: "20px",
                overflow: "hidden",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.5)",
                },
              }}
            >
              <CardMedia
                component="img"
                height="250"
                image={photographer.image}
                alt={photographer.name}
                sx={{
                  filter: "brightness(0.9)",
                  transition: "filter 0.3s",
                  "&:hover": {
                    filter: "brightness(1.1)",
                  },
                }}
              />
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    color: "#aaa",
                    mb: 1,
                  }}
                >
                  {photographer.category}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    mt: 1,
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  {photographer.name}
                </Typography>
                <Rating
                  value={photographer.stars}
                  readOnly
                  precision={0.5}
                  sx={{ mt: 1, color: "#ffd700" }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    mt: 2,
                    fontSize: "0.9rem",
                    color: "#ccc",
                  }}
                >
                  {photographer.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PopularPhotographers;
