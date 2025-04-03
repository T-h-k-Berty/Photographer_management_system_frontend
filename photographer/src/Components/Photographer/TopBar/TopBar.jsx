import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PhotographerTopBar from "./PhotographerTopBar";
import ClientTopBar from "./ClientTopBar";

const TopBar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (!user) return null;

  return user.role === "photographer" ? (
    <PhotographerTopBar user={user} />
  ) : (
    <ClientTopBar user={user} />
  );
};

export default TopBar;
