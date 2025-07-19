// SurpriseGiftBoxOffer.jsx

import React, { useState } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

// --- Confetti Burst ---
const ConfettiBurst = ({ show }) => {
  const confettiColors = [
    "#FFD600", "#F44336", "#4CAF50", "#2196F3", "#FF9800", "#9C27B0", "#00BCD4", "#E91E63"
  ];
  // Array of random confetti particles
  const confetti = Array.from({ length: 24 }, (_, i) => ({
    x: Math.random() * 120 - 60,
    y: Math.random() * 100 - 60,
    r: 4 + Math.random() * 3,
    color: confettiColors[i % confettiColors.length],
    rotate: Math.random() * 180,
    delay: Math.random() * 0.2
  }));

  return (
    <AnimatePresence>
      {show &&
        <svg
          width="250" height="130"
          style={{
            position: "absolute",
            left: "50%",
            top: "-58px",
            transform: "translateX(-50%)",
            pointerEvents: "none",
            zIndex: 3
          }}
        >
          {confetti.map((c, idx) => (
            <motion.circle
              key={idx}
              initial={{ cx: 125, cy: 90, opacity: 0, scale: 0.3, rotate: 0 }}
              animate={{
                cx: 125 + c.x,
                cy: 90 - c.y,
                opacity: [1, 1, 0.8, 0],
                scale: [1.05, 1, 0.8],
                rotate: c.rotate
              }}
              exit={{ opacity: 0, scale: 0.3 }}
              transition={{
                duration: 1.05,
                delay: 0.18 + c.delay,
                type: "spring",
                stiffness: 170,
                damping: 12
              }}
              r={c.r}
              fill={c.color}
            />
          ))}
        </svg>
      }
    </AnimatePresence>
  );
};

// --- SVG Gift Box, animated lid ---
const GiftBox = ({ opened }) => (
  <svg width="250" height="200" viewBox="0 0 250 200" fill="none">
    {/* Bottom Box */}
    <rect x="62" y="90" width="126" height="78" rx="11"
      fill="#F44336" stroke="#e53935" strokeWidth="5" />
    {/* Yellow Ribbon */}
    <rect x="121" y="90" width="8" height="78" fill="#FFD600" rx="4" />
    <rect x="62" y="127" width="126" height="8" fill="#FFD600" rx="4" />
    {/* Lid (animated) */}
    <motion.g
      style={{ transformOrigin: "165px 93px" }}
      animate={opened
        ? { rotate: -45, x: 38, y: -40 }
        : { rotate: 0, x: 0, y: 0 }
      }
      transition={{
        type: "spring", stiffness: 200, damping: 16
      }}
    >
      {/* Lid base */}
      <rect x="52" y="65" width="146" height="36" rx="9"
        fill="#F44336" stroke="#e53935" strokeWidth="5" />
      {/* Ribbon on Lid */}
      <rect x="123" y="65" width="8" height="36" fill="#FFD600" rx="4" />
      {/* Bow left */}
      <ellipse cx="90" cy="67" rx="17" ry="10" fill="#FFD600" stroke="#A98500" strokeWidth="3" />
      {/* Bow right */}
      <ellipse cx="161" cy="67" rx="17" ry="10" fill="#FFD600" stroke="#A98500" strokeWidth="3" />
      {/* Bow center circle */}
      <circle cx="126" cy="70" r="7" fill="#FFD600" stroke="#A98500" strokeWidth="2.5" />
    </motion.g>
    {/* Shadow */}
    <ellipse cx="125" cy="178" rx="56" ry="12" fill="#0002" />
  </svg>
);

// --- Main Animated Offer Page ---
const SurpriseGiftBoxOffer = () => {
  const [opened, setOpened] = useState(false);

  return (
    <Box
      className="d-flex align-items-center justify-content-center"
      sx={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at 70% 40%, #fffde7 0%, #ffd60011 65%, #181818 100%)",
        overflow: "hidden",
        flexDirection: "column"
      }}
    >
      {/* Animated Title */}
      <Typography
        variant="h3"
        fontWeight={900}
        sx={{
          mb: 3, color: "#FFD600", textShadow: "0 2px 10px #FFD60055", letterSpacing: 1.5
        }}
        component={motion.h1}
        initial={{ y: -50, opacity: 0, scale: 0.7 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 16, delay: 0.15 }}
      >
        Tap the Gift to Reveal Your Offer!
      </Typography>

      {/* Gift Box with Confetti */}
      <Box sx={{ position: "relative", width: 260, height: 220, mb: 4 }}>
        {/* Confetti */}
        <ConfettiBurst show={opened} />
        {/* Gift box SVG */}
        <Box
          sx={{
            width: 250,
            height: 200,
            cursor: opened ? "default" : "pointer",
            mx: "auto",
            userSelect: "none",
            position: "relative",
            zIndex: 2
          }}
          onClick={() => !opened && setOpened(true)}
        >
          <GiftBox opened={opened} />
        </Box>
        {/* Animated OFFER Card */}
        <AnimatePresence>
          {opened && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 80 }}
              animate={{ scale: 1.08, opacity: 1, y: -18 }}
              exit={{ scale: 0.3, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 280, damping: 17 }}
              style={{
                position: "absolute",
                left: "50%",
                top: 38,
                zIndex: 5,
                transform: "translateX(-50%)",
                width: 290,
                maxWidth: "90vw",
                pointerEvents: "none"
              }}
            >
              <Paper
                elevation={12}
                sx={{
                  py: 4, px: { xs: 2, md: 5 },
                  borderRadius: "32px",
                  background: "linear-gradient(90deg,#FFD600 84%,#FFFDE7 100%)",
                  color: "#865600",
                  border: "3px solid #FFD600",
                  boxShadow: "0 7px 60px #FFD60033, 0 1.5px 9px #0009"
                }}
              >
                <Typography
                  variant="h2"
                  fontWeight="bold"
                  sx={{
                    color: "#D35400",
                    textShadow: "0 2px 10px #FFD60088",
                    mb: 1,
                    fontSize: { xs: "2.1rem", sm: "2.5rem", md: "3rem" }
                  }}
                >
                  🎉 Exclusive Offer!
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight={900}
                  sx={{
                    color: "#181818",
                    fontSize: { xs: "1.2rem", sm: "2rem", md: "2.5rem" }
                  }}
                >
                  Get 30% OFF on Your First Booking!
                </Typography>
                <Typography
                  sx={{
                    color: "#A98500",
                    fontWeight: 500,
                    fontSize: 18,
                    mt: 1
                  }}
                >
                  * Use Code: <b>SURPRISE30</b>
                </Typography>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* Open Button (for accessibility/mobiles) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, type: "spring" }}
      >
        <Button
          variant="contained"
          size="large"
          sx={{
            background: "linear-gradient(90deg, #FFD600 80%, #FFFDE7 100%)",
            color: "#181818",
            borderRadius: "32px",
            px: 5, py: 1.3,
            fontWeight: 800,
            fontSize: 22,
            boxShadow: "0 3px 16px #FFD60066, 0 1.5px 9px #000a",
            textTransform: "none",
            mt: 2,
            pointerEvents: opened ? "none" : "auto"
          }}
          disabled={opened}
          onClick={() => setOpened(true)}
        >
          {opened ? "🎁 Offer Unlocked!" : "Open Gift"}
        </Button>
      </motion.div>
    </Box>
  );
};

export default SurpriseGiftBoxOffer;
