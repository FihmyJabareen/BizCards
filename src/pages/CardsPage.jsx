import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Box,
  CircularProgress,
  Fab,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import BCards from "../cards/components/BCards";
import { useSnack } from "../providers/SnackbarProvider";
import { useCurrentUser } from "../users/providers/UserProvider";
import ROUTES from "../routes/routesModel";

const API = "https://monkfish-app-z9uza.ondigitalocean.app/bcard2";

export default function CardsPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(""); // ← חיפוש
  const setSnack = useSnack();
  const { user, token } = useCurrentUser();
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/cards`);
      setCards(data);
    } catch (e) {
      console.error(e);
      setSnack("error", "Failed to load cards");
    } finally {
      setLoading(false);
    }
  }, [setSnack]);

  useEffect(() => {
    load();
  }, [load]);

  const normalize = (v) => (typeof v === "string" ? v.toLowerCase().trim() : "");
  const filterText = normalize(query);

  const visibleCards = useMemo(() => {
    if (!filterText) return cards;
    return cards.filter((c) => {
      const title = normalize(c.title);
      const subtitle = normalize(c.subtitle);
      const desc = normalize(c.description);
      const a = c.address || {};
      const addr = normalize(
        [a.street, a.houseNumber, a.city, a.state, a.country, a.zip].filter(Boolean).join(" ")
      );
      return (
        title.includes(filterText) ||
        subtitle.includes(filterText) ||
        desc.includes(filterText) ||
        addr.includes(filterText)
      );
    });
  }, [cards, filterText]);

  const isFavorite = useMemo(() => {
    if (!user) return () => false;
    return (cardId) => {
      const c = cards.find((x) => x._id === cardId);
      return c ? Array.isArray(c.likes) && c.likes.includes(user._id) : false;
    };
  }, [user, cards]);

  const toggleLike = async (cardId) => {
    if (!token) return setSnack("warning", "Must Logged In To Like");

    const prev = cards;
    const next = cards.map((c) => {
      if (c._id !== cardId) return c;
      const likes = Array.isArray(c.likes) ? [...c.likes] : [];
      const i = likes.indexOf(user._id);
      if (i > -1) likes.splice(i, 1);
      else likes.push(user._id);
      return { ...c, likes };
    });
    setCards(next);

    try {
      await axios.patch(`${API}/cards/${cardId}`, null, {
        headers: { "x-auth-token": token },
      });
    } catch (e) {
      console.error(e);
      setSnack("error", "Can Not Complete The LIKE process !");
      setCards(prev);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1, pb: 8  }}>
      <Typography variant="h5" sx={{ mb: 2 }}> All Cards </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by Title \ Description \ Address"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <BCards
        cards={visibleCards}
        toggleLike={toggleLike}
        isFavorite={isFavorite}
        emptyText={query ? "No Cards found matching the search." : "There are no Cards to display."}
      />

      {user?.isBusiness && (
        <Fab
          color="primary"
          aria-label="create"
          onClick={() => navigate(ROUTES.createCard)}
          sx={{ position: "fixed", bottom: 24, right: 24 }}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
}
