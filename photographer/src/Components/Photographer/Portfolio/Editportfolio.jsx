// === EditPortfolio.jsx ===
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import CreatePortfolio from "./CreatePortfolio";
import Footer from "../Footer/Footer";

const EditPortfolio = () => {
  const { portfolioId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/portfolios/${portfolioId}`);
        const portfolio = res.data;

        const personalDetails = {
          shopName: portfolio.shopName,
          photographerName: portfolio.photographerName,
          profilePicture: null,
          backgroundPicture: null,
          existingProfilePicture: portfolio.profilePicture,
          existingBackgroundPicture: portfolio.backgroundPicture,
          description: portfolio.description,
          selectedEvents: portfolio.selectedEvents || [],
        };

        const galleries = portfolio.Galleries?.map((g) => ({
          id: g.id,
          eventType: g.eventType,
          description: g.description,
          photo1: null,
          photo2: null,
          photo3: null,
          existingPhoto1: g.photo1,
          existingPhoto2: g.photo2,
          existingPhoto3: g.photo3,
        })) || [];

        const packages = portfolio.Packages?.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          price: p.price,
        })) || [];

        let locations = [];
        try {
          locations = Array.isArray(portfolio.locations)
            ? portfolio.locations
            : JSON.parse(portfolio.locations || "[]");
        } catch (e) {
          console.warn("Invalid locations format", e);
          locations = [];
        }

        setInitialData({ personalDetails, galleries, packages, locations });
      } catch (err) {
        console.error("Failed to fetch portfolio", err);
        alert("Failed to load portfolio.");
      }
    };

    fetchPortfolio();
  }, [portfolioId]);

  const handleUpdateSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("userId", user.id);
      formData.append("shopName", data.personalDetails.shopName);
      formData.append("photographerName", data.personalDetails.photographerName);
      formData.append("description", data.personalDetails.description);
      if (data.personalDetails.profilePicture) formData.append("profilePicture", data.personalDetails.profilePicture);
      if (data.personalDetails.backgroundPicture) formData.append("backgroundPicture", data.personalDetails.backgroundPicture);
      formData.append("selectedEvents", JSON.stringify(data.personalDetails.selectedEvents));
      formData.append("locations", JSON.stringify(data.locations));

      const galleryData = data.galleries.map((g, index) => {
        const gallery = {
          id: g.id,
          eventType: g.eventType,
          description: g.description
        };
        ["photo1", "photo2", "photo3"].forEach((key) => {
          if (g[key]) {
            const fieldName = `galleryPhotos[${index}][${key}]`;
            formData.append(fieldName, g[key]);
            gallery[key] = fieldName;
          } else if (g[`existing${key.charAt(0).toUpperCase() + key.slice(1)}`]) {
            gallery[key] = g[`existing${key.charAt(0).toUpperCase() + key.slice(1)}`];
          }
        });
        return gallery;
      });

      const packageData = data.packages.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        price: p.price,
      }));

      formData.append("galleries", JSON.stringify(galleryData));
      formData.append("packages", JSON.stringify(packageData));

      await axios.put(`http://localhost:5000/api/portfolios/${portfolioId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Portfolio updated successfully!");
      navigate("/photographer/view-portfolio");
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update portfolio.");
    }
  };

  return (
    <>
      {initialData ? (
        <CreatePortfolio
          initialData={initialData}
          isEdit={true}
          onSubmit={handleUpdateSubmit}
        />
      ) : (
        <p style={{ color: "white", textAlign: "center", marginTop: "100px" }}>Loading portfolio for editing...</p>
      )}


    </>
  );
};

export default EditPortfolio;