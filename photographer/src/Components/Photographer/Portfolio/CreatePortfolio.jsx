import {
  TextField,
  Checkbox,
  Button,
  Typography,
  Box,
  Grid,
  FormControlLabel,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Chip,
  Autocomplete,
  InputAdornment,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import axios from "axios";
import TopBar from "../TopBar/TopBar";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Footer from "../Footer/Footer";

const eventTypes = ["Wedding", "Fashion", "Nature", "Beach"];
const sriLankanLocations = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle",
  "Gampaha", "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle",
  "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Monaragala",
  "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam", "Ratnapura",
  "Trincomalee", "Vavuniya"
];

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    color: "white",
    "& fieldset": { borderColor: "#666" },
    "&:hover fieldset": { borderColor: "#999" },
    "&.Mui-focused fieldset": { borderColor: "#fff" },
    "& input, & textarea": { color: "white" },
  },
  "& .MuiInputLabel-root": { color: "#aaa" },
  "& .Mui-focused .MuiInputLabel-root": { color: "#fff" },
};

const urlValidator = {
  facebook: /^(https?:\/\/)?(www\.)?facebook\.com\/[A-Za-z0-9_.-]+\/?$/,
  instagram: /^(https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9_.-]+\/?$/,
  twitter: /^(https?:\/\/)?(www\.)?twitter\.com\/[A-Za-z0-9_]+\/?$/,
  whatsapp: /^(https?:\/\/)?(wa\.me\/\d+|api\.whatsapp\.com\/send\?phone=\d+)\/?$/,
};

const CreatePortfolio = ({ initialData = null, isEdit = false, onSubmit }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (initialData) {
      setPersonalDetails(initialData.personalDetails);
      setGalleries(initialData.galleries);
      setPackages(initialData.packages);
      setLocations(initialData.locations);
      setSocialLinks(initialData.socialLinks || {
        facebook: "",
        instagram: "",
        twitter: "",
        whatsapp: "",
      });
    }
  }, [initialData]);

  const [personalDetails, setPersonalDetails] = useState({
    shopName: "",
    photographerName: "",
    profilePicture: null,
    backgroundPicture: null,
    description: "",
    selectedEvents: [],
  });
  const [locations, setLocations] = useState([]);
  const [galleries, setGalleries] = useState([
    { photo1: null, photo2: null, photo3: null, description: "", eventType: "" },
  ]);
  const [packages, setPackages] = useState([
    { title: "", description: "", price: "" },
  ]);
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
    whatsapp: "",
  });
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  // ------- Handlers ---------
  const handlePersonalChange = (e) => {
    const { name, value, files } = e.target;
    setPersonalDetails({
      ...personalDetails,
      [name]: files ? files[0] : value,
    });
    setErrors({ ...errors, [name]: "" });
  };

  const handleEventCheckbox = (eventType) => {
    const updated = personalDetails.selectedEvents.includes(eventType)
      ? personalDetails.selectedEvents.filter((e) => e !== eventType)
      : [...personalDetails.selectedEvents, eventType];
    setPersonalDetails({ ...personalDetails, selectedEvents: updated });
    setErrors({ ...errors, selectedEvents: "" });
  };

  const handleAddLocation = (event, value) => {
    if (value && !locations.includes(value)) {
      setLocations([...locations, value]);
      setErrors({ ...errors, locations: "" });
    }
  };

  const handleRemoveLocation = (toRemove) => {
    setLocations(locations.filter((loc) => loc !== toRemove));
  };

  const addGallery = () => {
    setGalleries((prev) => [
      ...prev,
      { photo1: null, photo2: null, photo3: null, description: "", eventType: "" },
    ]);
  };

  const removeGallery = (index) => {
    setGalleries(galleries.filter((_, i) => i !== index));
  };

  const addPackage = () => {
    setPackages((prev) => [
      ...prev,
      { title: "", description: "", price: "" },
    ]);
  };

  const removePackage = (index) => {
    setPackages(packages.filter((_, i) => i !== index));
  };

  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks({ ...socialLinks, [name]: value });
    setErrors({ ...errors, [`${name}Link`]: "" });
  };

  // ------------- Validation Logic ---------------
  const validate = () => {
    const newErrors = {};

    // Personal Details
    if (!personalDetails.shopName) newErrors.shopName = "Shop name is required";
    if (!personalDetails.photographerName) newErrors.photographerName = "Photographer name is required";
    if (!personalDetails.description) newErrors.description = "Description is required";
    if (!locations.length) newErrors.locations = "Add at least one location";
    if (!personalDetails.selectedEvents.length) newErrors.selectedEvents = "Select at least one event type";

    // Social Media links (if filled, must be valid)
    Object.entries(socialLinks).forEach(([key, val]) => {
      if (val && urlValidator[key] && !urlValidator[key].test(val)) {
        newErrors[`${key}Link`] = `Invalid ${key} link`;
      }
    });

    // Galleries: If description or eventType is filled, require at least one photo.
    galleries.forEach((g, idx) => {
      const gErr = {};
      if ((g.description || g.eventType) && ![g.photo1, g.photo2, g.photo3].some(Boolean)) {
        gErr.photos = "At least one photo is required for a described/event gallery";
      }
      if ((g.description && !g.eventType) || (!g.description && g.eventType)) {
        gErr.main = "Fill both description and event type if providing one";
      }
      if (Object.keys(gErr).length > 0) {
        if (!newErrors.galleries) newErrors.galleries = {};
        newErrors.galleries[idx] = gErr;
      }
    });

    // Packages: if any field filled, require all fields
    packages.forEach((pkg, idx) => {
      const filled = pkg.title || pkg.description || pkg.price;
      if (filled && (!pkg.title || !pkg.description || !pkg.price)) {
        if (!newErrors.packages) newErrors.packages = {};
        newErrors.packages[idx] = "Fill all package fields";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ------------- Submit ---------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (!validate()) {
      return;
    }

    const payload = {
      personalDetails,
      galleries,
      packages,
      locations,
      socialLinks,
    };

    if (isEdit && onSubmit) {
      await onSubmit(payload);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("userId", user.id);
      formData.append("shopName", personalDetails.shopName);
      formData.append("photographerName", personalDetails.photographerName);
      formData.append("description", personalDetails.description);
      formData.append("profilePicture", personalDetails.profilePicture);
      formData.append("backgroundPicture", personalDetails.backgroundPicture);
      formData.append("selectedEvents", JSON.stringify(personalDetails.selectedEvents));
      formData.append("locations", JSON.stringify(locations));
      formData.append("socialLinks", JSON.stringify(socialLinks));

      const galleryData = [];
      galleries.forEach((gallery, index) => {
        const g = { eventType: gallery.eventType, description: gallery.description };
        ["photo1", "photo2", "photo3"].forEach((key) => {
          if (gallery[key]) {
            const fieldName = `galleryPhotos[${index}][${key}]`;
            formData.append(fieldName, gallery[key]);
            g[key] = fieldName;
          }
        });
        galleryData.push(g);
      });

      formData.append("galleries", JSON.stringify(galleryData));
      formData.append("packages", JSON.stringify(packages));

      await axios.post("http://localhost:5000/api/portfolios", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Portfolio created successfully!");
      navigate("/photographer/view-portfolio");
    } catch (err) {
      console.error("Error submitting portfolio:", err);
      alert("Submission failed");
    }
  };

  // ---------- Render ----------
  return (
    <>
      <TopBar />
      <Box sx={{ backgroundColor: "#000", minHeight: "100vh", py: 6, color: "white", pt: 10 }}>
        <Box maxWidth="1000px" mx="auto">
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
            {isEdit ? "Edit Portfolio" : "Create Portfolio"}
          </Typography>

          <Typography variant="h5" gutterBottom>Personal Details</Typography>
          <Grid container spacing={2} className="mb-4">
            {["shopName", "photographerName", "description"].map((field, i) => (
              <Grid item xs={12} key={i}>
                <TextField
                  fullWidth
                  name={field}
                  label={field.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
                  value={personalDetails[field]}
                  onChange={handlePersonalChange}
                  multiline={field === "description"}
                  rows={field === "description" ? 2 : 1}
                  sx={inputStyle}
                  error={!!(formSubmitted && errors[field])}
                  helperText={formSubmitted && errors[field]}
                />
              </Grid>
            ))}
            {["profilePicture", "backgroundPicture"].map((imgField, idx) => (
              <Grid item xs={12} key={idx}>
                <Typography>
                  {imgField.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}:
                </Typography>
                <input
                  type="file"
                  name={imgField}
                  accept="image/*"
                  onChange={handlePersonalChange}
                  style={{ color: "white" }}
                />
              </Grid>
            ))}

            {/* --- Social Media Fields --- */}
            <Grid item xs={12}>
              <Typography sx={{ mt: 2, mb: 1, fontWeight: 500 }}>
                Social Media Links (optional)
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    name="facebook"
                    label="Facebook"
                    value={socialLinks.facebook}
                    onChange={handleSocialLinkChange}
                    sx={inputStyle}
                    variant="outlined"
                    placeholder="https://facebook.com/yourprofile"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FacebookIcon sx={{ color: "#1877f3" }} />
                        </InputAdornment>
                      ),
                    }}
                    error={!!(formSubmitted && errors.facebookLink)}
                    helperText={formSubmitted && errors.facebookLink}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    name="instagram"
                    label="Instagram"
                    value={socialLinks.instagram}
                    onChange={handleSocialLinkChange}
                    sx={inputStyle}
                    variant="outlined"
                    placeholder="https://instagram.com/yourprofile"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <InstagramIcon sx={{ color: "#E4405F" }} />
                        </InputAdornment>
                      ),
                    }}
                    error={!!(formSubmitted && errors.instagramLink)}
                    helperText={formSubmitted && errors.instagramLink}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    name="twitter"
                    label="Twitter"
                    value={socialLinks.twitter}
                    onChange={handleSocialLinkChange}
                    sx={inputStyle}
                    variant="outlined"
                    placeholder="https://twitter.com/yourprofile"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TwitterIcon sx={{ color: "#1DA1F2" }} />
                        </InputAdornment>
                      ),
                    }}
                    error={!!(formSubmitted && errors.twitterLink)}
                    helperText={formSubmitted && errors.twitterLink}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    name="whatsapp"
                    label="WhatsApp"
                    value={socialLinks.whatsapp}
                    onChange={handleSocialLinkChange}
                    sx={inputStyle}
                    variant="outlined"
                    placeholder="https://wa.me/your-number"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <WhatsAppIcon sx={{ color: "#25D366" }} />
                        </InputAdornment>
                      ),
                    }}
                    error={!!(formSubmitted && errors.whatsappLink)}
                    helperText={formSubmitted && errors.whatsappLink}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography>Locations:</Typography>
              <Autocomplete
                options={sriLankanLocations}
                onChange={handleAddLocation}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Add Location"
                    sx={inputStyle}
                    variant="outlined"
                    error={!!(formSubmitted && errors.locations)}
                    helperText={formSubmitted && errors.locations}
                  />
                )}
                sx={{ mb: 1 }}
              />
              <Box display="flex" flexWrap="wrap" gap={1}>
                {locations.map((loc, index) => (
                  <Chip
                    key={index}
                    label={loc}
                    onDelete={() => handleRemoveLocation(loc)}
                    deleteIcon={<CloseIcon sx={{ color: "white" }} />}
                    sx={{ backgroundColor: "#333", color: "white" }}
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography>Event Types:</Typography>
              <Box display="flex" flexWrap="wrap" gap={2}>
                {eventTypes.map((type) => (
                  <FormControlLabel
                    key={type}
                    control={
                      <Checkbox
                        checked={personalDetails.selectedEvents.includes(type)}
                        onChange={() => handleEventCheckbox(type)}
                        sx={{ color: "white" }}
                      />
                    }
                    label={<span style={{ color: "white" }}>{type}</span>}
                  />
                ))}
              </Box>
              {formSubmitted && errors.selectedEvents && (
                <Typography color="error" variant="body2" sx={{ ml: 1, mt: 0.5 }}>
                  {errors.selectedEvents}
                </Typography>
              )}
            </Grid>
          </Grid>
        {/* Gallery Section */}
        <Typography variant="h5" gutterBottom>Adding Gallery</Typography>
        <Grid container spacing={3}>
          {galleries.map((gallery, idx) => (
            <Grid item xs={12} key={idx}>
              <Card sx={{ backgroundColor: "#111", border: "1px solid #333", color: "white" }}>
                <CardHeader
                  title={`Gallery ${idx + 1}`}
                  action={
                    <>
                      {idx === galleries.length - 1 && (
                        <IconButton onClick={addGallery} sx={{ color: "white" }}>
                          <AddCircleOutlineIcon />
                        </IconButton>
                      )}
                      {galleries.length > 1 && (
                        <IconButton onClick={() => removeGallery(idx)} sx={{ color: "red" }}>
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </>
                  }
                  sx={{ borderBottom: "1px solid #333", pb: 0 }}
                />
                <CardContent>
                  <Grid container spacing={2}>
                    {[1, 2, 3].map((num) => (
                      <Grid item xs={12} sm={4} key={num}>
                        <Typography gutterBottom>{`Photo - ${num}`}</Typography>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            const updated = [...galleries];
                            updated[idx][`photo${num}`] = file;
                            setGalleries(updated);
                            if (errors.galleries?.[idx]) {
                              setErrors({ ...errors, galleries: { ...errors.galleries, [idx]: {} } });
                            }
                          }}
                          style={{ display: "block", color: "white" }}
                        />
                        {gallery[`photo${num}`] && (
                          <Box mt={1}>
                            <img
                              src={URL.createObjectURL(gallery[`photo${num}`])}
                              alt={`Preview ${num}`}
                              style={{ width: "100%", maxHeight: "150px", objectFit: "cover", borderRadius: 8 }}
                            />
                          </Box>
                        )}
                      </Grid>
                    ))}
                    <Grid item xs={12}>
                      <Typography>Description</Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        value={gallery.description}
                        onChange={(e) => {
                          const updated = [...galleries];
                          updated[idx].description = e.target.value;
                          setGalleries(updated);
                        }}
                        sx={inputStyle}
                        variant="outlined"
                        error={!!(formSubmitted && errors.galleries?.[idx]?.main)}
                        helperText={formSubmitted && errors.galleries?.[idx]?.main}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography>Event Type</Typography>
                      <TextField
                        fullWidth
                        value={gallery.eventType}
                        onChange={(e) => {
                          const updated = [...galleries];
                          updated[idx].eventType = e.target.value;
                          setGalleries(updated);
                        }}
                        sx={inputStyle}
                        variant="outlined"
                        error={!!(formSubmitted && errors.galleries?.[idx]?.main)}
                        helperText={formSubmitted && errors.galleries?.[idx]?.main}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      {formSubmitted && errors.galleries?.[idx]?.photos && (
                        <Typography color="error" variant="body2">
                          {errors.galleries[idx].photos}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Package Section */}
        <Typography variant="h5" gutterBottom mt={5}>Packages</Typography>
        <Grid container spacing={3}>
          {packages.map((pkg, idx) => (
            <Grid item xs={12} key={idx}>
              <Card sx={{ backgroundColor: "#111", border: "1px solid #333", color: "white" }}>
                <CardHeader
                  title={`Package ${idx + 1}`}
                  action={
                    <>
                      {idx === packages.length - 1 && (
                        <IconButton onClick={addPackage} sx={{ color: "white" }}>
                          <AddCircleOutlineIcon />
                        </IconButton>
                      )}
                      {packages.length > 1 && (
                        <IconButton onClick={() => removePackage(idx)} sx={{ color: "red" }}>
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </>
                  }
                  sx={{ borderBottom: "1px solid #333", pb: 0 }}
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography>Package Title</Typography>
                      <TextField
                        fullWidth
                        value={pkg.title}
                        onChange={(e) => {
                          const updated = [...packages];
                          updated[idx].title = e.target.value;
                          setPackages(updated);
                        }}
                        sx={inputStyle}
                        variant="outlined"
                        error={!!(formSubmitted && errors.packages?.[idx])}
                        helperText={formSubmitted && errors.packages?.[idx]}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography>Package Description</Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        value={pkg.description}
                        onChange={(e) => {
                          const updated = [...packages];
                          updated[idx].description = e.target.value;
                          setPackages(updated);
                        }}
                        sx={inputStyle}
                        variant="outlined"
                        error={!!(formSubmitted && errors.packages?.[idx])}
                        helperText={formSubmitted && errors.packages?.[idx]}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography>Package Price</Typography>
                      <TextField
                        fullWidth
                        value={pkg.price}
                        onChange={(e) => {
                          const updated = [...packages];
                          updated[idx].price = e.target.value;
                          setPackages(updated);
                        }}
                        sx={inputStyle}
                        variant="outlined"
                        error={!!(formSubmitted && errors.packages?.[idx])}
                        helperText={formSubmitted && errors.packages?.[idx]}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Submit Button */}
        <Box textAlign="center" mt={4}>
          <Button
            variant="contained"
            type="submit"
            onClick={handleSubmit}
            sx={{
              backgroundColor: "white",
              color: "black",
              fontWeight: "bold",
              px: 5,
              py: 1,
              fontSize: "1rem",
              borderRadius: "30px"
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
    <Footer />
    </>
  );
};

export default CreatePortfolio;
