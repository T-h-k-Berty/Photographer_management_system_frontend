import React from "react";
import {
  Box, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel,
  IconButton, Card, Stack, Tooltip
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SortIcon from "@mui/icons-material/Sort";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const eventTypes = [
  "Wedding", "Birthday", "Graduation", "Corporate", "Portrait", "Family", "Other"
];
const locations = [
  "Colombo", "Galle", "Kandy", "Jaffna", "Negombo", "Gampaha", "Other"
];

const PhotographerSearchBar = ({
  search, setSearch, eventType, setEventType, location, setLocation,
  sortBy, setSortBy, sortOrder, setSortOrder, date, setDate
}) => {
  return (
    <Card
      elevation={9}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 5,
        boxShadow: "0 8px 32px #FFD60033, 0 1.5px 9px #000b",
        background: "rgba(33,33,33,0.94)",
        mb: 2,
        mt: { xs: 1, md: 3 }
      }}
    >
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center" justifyContent="center">
        <TextField
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search photographer..."
          variant="outlined"
          size="medium"
          sx={{
            minWidth: { xs: "100%", md: 230 },
            background: "#181818",
            borderRadius: 3,
            input: { color: "#FFD600", fontWeight: 600 }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonSearchIcon sx={{ color: "#FFD600" }} />
              </InputAdornment>
            ),
          }}
        />

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel sx={{ color: "#FFD600" }}>
            <EventAvailableIcon sx={{ mr: 1, fontSize: 18 }} />
            Event Type
          </InputLabel>
          <Select
            value={eventType}
            onChange={e => setEventType(e.target.value)}
            label="Event Type"
            sx={{
              color: "#FFD600",
              ".MuiOutlinedInput-notchedOutline": { borderColor: "#FFD600" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#FFD600" }
            }}
            displayEmpty
          >
            <MenuItem value="">
              <em>All Events</em>
            </MenuItem>
            {eventTypes.map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel sx={{ color: "#FFD600" }}>
            <LocationOnIcon sx={{ mr: 1, fontSize: 18 }} />
            Location
          </InputLabel>
          <Select
            value={location}
            onChange={e => setLocation(e.target.value)}
            label="Location"
            sx={{
              color: "#FFD600",
              ".MuiOutlinedInput-notchedOutline": { borderColor: "#FFD600" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#FFD600" }
            }}
            displayEmpty
          >
            <MenuItem value="">
              <em>All Locations</em>
            </MenuItem>
            {locations.map(loc => (
              <MenuItem key={loc} value={loc}>{loc}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label={
            <Box sx={{ display: "flex", alignItems: "center", color: "#FFD600" }}>
              <CalendarMonthIcon sx={{ mr: 1, fontSize: 18 }} />
              Date
            </Box>
          }
          type="date"
          size="medium"
          value={date}
          onChange={e => setDate(e.target.value)}
          sx={{
            minWidth: 145,
            input: { color: "#FFD600", background: "#181818", borderRadius: 2 }
          }}
          InputLabelProps={{ shrink: true, style: { color: "#FFD600" } }}
        />

        {/* Sort */}
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel sx={{ color: "#FFD600" }}>
            <SortIcon sx={{ mr: 1, fontSize: 18 }} />
            Sort By
          </InputLabel>
          <Select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            label="Sort By"
            sx={{
              color: "#FFD600",
              ".MuiOutlinedInput-notchedOutline": { borderColor: "#FFD600" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#FFD600" }
            }}
          >
            <MenuItem value="rating">
              <SearchIcon fontSize="small" sx={{ mr: 1 }} /> Rating
            </MenuItem>
            <MenuItem value="name">
              <PersonSearchIcon fontSize="small" sx={{ mr: 1 }} /> Name
            </MenuItem>
            <MenuItem value="date">
              <CalendarMonthIcon fontSize="small" sx={{ mr: 1 }} /> Date
            </MenuItem>
          </Select>
        </FormControl>
        <Tooltip title={sortOrder === "desc" ? "Descending" : "Ascending"}>
          <IconButton
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            sx={{ color: "#FFD600", borderRadius: 2, border: "1.5px solid #FFD600", ml: 0.5 }}
          >
            {sortOrder === "desc" ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
          </IconButton>
        </Tooltip>
      </Stack>
    </Card>
  );
};

export default PhotographerSearchBar;
