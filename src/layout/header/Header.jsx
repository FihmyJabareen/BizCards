import { useState, useMemo } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Link, useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../users/providers/UserProvider";
import { useCustomTheme } from "../../providers/CustomThemeProvider";
import ROUTES from "../../routes/routesModel";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useCurrentUser();
  const { mode, toggleColorMode } = useCustomTheme();
  const isDesktop = useMediaQuery("(min-width:900px)");
  const [open, setOpen] = useState(false);

  const commonLinks = useMemo(() => [
    { label: "Home", to: ROUTES.root },
    { label: "About", to: ROUTES.about },
  ], []);

  const authedLinks = useMemo(() => [
    { label: "Favorites", to: ROUTES.favorite },
    { label: "My Cards", to: ROUTES.myCards },
    { label: "Create", to: ROUTES.createCard },
  ], []);

  const authButtons = (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {!user ? (
        <>
          <Button color="inherit" component={Link} to={ROUTES.login}>Login</Button>
          <Button color="inherit" component={Link} to={ROUTES.register}>Register</Button>
        </>
      ) : (
        <Button
          color="inherit"
          onClick={() => {
            logout();
            navigate(ROUTES.root);
          }}
        >
          Logout
        </Button>
      )}
      <Tooltip title={mode === "dark" ? "Light mode" : "Dark mode"}>
        <IconButton color="inherit" onClick={toggleColorMode} aria-label="toggle theme">
          {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );

  return (
    <AppBar position="sticky" enableColorOnDark>
      <Toolbar sx={{ display: "flex", gap: 2 }}>
        {/* Left: Brand / Home */}
        <Typography
          variant="h6"
          sx={{ cursor: "pointer", flexGrow: { xs: 1, md: 0 } }}
          onClick={() => navigate(ROUTES.root)}
        >
          BizCards
        </Typography>

        {/* Desktop nav */}
        {isDesktop && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2, flexGrow: 1 }}>
            {commonLinks.map((link) => (
              <Button key={link.to} color="inherit" component={Link} to={link.to}>
                {link.label}
              </Button>
            ))}
            {!!user && authedLinks.map((link) => (
              <Button key={link.to} color="inherit" component={Link} to={link.to}>
                {link.label}
              </Button>
            ))}
          </Box>
        )}

        {/* Spacer on desktop */}
        {isDesktop && <Box sx={{ flexGrow: 1 }} />}

        {/* Right side controls (desktop) */}
        {isDesktop ? (
          authButtons
        ) : (
          // Mobile hamburger
          <IconButton
            color="inherit"
            edge="end"
            onClick={() => setOpen(true)}
            aria-label="open navigation menu"
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 280, display: "flex", flexDirection: "column", height: "100%" }} role="presentation">
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Menu</Typography>
          </Box>
          <Divider />
          <List>
            {commonLinks.map((link) => (
              <ListItemButton
                key={link.to}
                component={Link}
                to={link.to}
                onClick={() => setOpen(false)}
              >
                <ListItemText primary={link.label} />
              </ListItemButton>
            ))}
            {!!user && authedLinks.map((link) => (
              <ListItemButton
                key={link.to}
                component={Link}
                to={link.to}
                onClick={() => setOpen(false)}
              >
                <ListItemText primary={link.label} />
              </ListItemButton>
            ))}
          </List>
          <Box sx={{ mt: "auto", p: 2, borderTop: 1, borderColor: "divider" }}>
            {authButtons}
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}
