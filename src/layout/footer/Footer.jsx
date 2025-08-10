import React, { useMemo } from "react";
import { Paper, BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { useNavigate, useLocation } from "react-router-dom";

import ROUTES from "../../routes/routesModel";
import { useCurrentUser } from "../../users/providers/UserProvider";

export default function Footer() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useCurrentUser();

  const tabs = useMemo(() => [
    { key: "home", label: "Home", icon: <HomeOutlinedIcon />, to: ROUTES.root, enabled: true },
    { key: "about", label: "About", icon: <InfoOutlinedIcon />, to: ROUTES.about, enabled: true },
    { key: "favorites", label: "Favorites", icon: <FavoriteIcon />, to: ROUTES.favorite, enabled: !!user },
    { key: "mycards", label: "My Cards", icon: <CreditCardIcon />, to: ROUTES.myCards, enabled: !!user },
  ], [user]);

  const value = useMemo(() => {
    if (pathname.startsWith(ROUTES.favorite)) return "favorites";
    if (pathname.startsWith(ROUTES.myCards)) return "mycards";
    if (pathname.startsWith(ROUTES.about)) return "about";
    return "home";
  }, [pathname]);

  const handleChange = (_e, newValue) => {
    const tab = tabs.find(t => t.key === newValue);
    if (tab && tab.enabled) navigate(tab.to);
  };

  return (
    <Paper elevation={6} sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}>
      <BottomNavigation showLabels value={value} onChange={handleChange}>
        {tabs.map((t) => (
          <BottomNavigationAction
            key={t.key}
            value={t.key}
            label={t.label}
            icon={t.icon}
            disabled={!t.enabled}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
