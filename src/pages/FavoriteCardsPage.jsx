import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Box, CircularProgress, Typography } from "@mui/material";
import BCards from "../cards/components/BCards";
import { useCurrentUser } from "../users/providers/UserProvider";
import { useSnack } from "../providers/SnackbarProvider";

const API = "https://monkfish-app-z9uza.ondigitalocean.app/bcard2";

export default function FavoriteCardsPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useCurrentUser();
  const setSnack = useSnack();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/cards`);
      const liked = user ? data.filter((c) => Array.isArray(c.likes) && c.likes.includes(user._id)) : [];
      setCards(liked);
    } catch (e) {
      console.error(e);
      setSnack("error", "Failed to load favorite cards");
    } finally {
      setLoading(false);
    }
  }, [user, setSnack]);

  useEffect(() => { load(); }, [load]);

  const isFavorite = useMemo(() => {
    if (!user) return () => false;
    return (cardId) => cards.some((c) => c._id === cardId && Array.isArray(c.likes) && c.likes.includes(user._id));
  }, [user, cards]);

  const toggleLike = async (cardId) => {
    if (!token) return setSnack("warning", "Please Log In");

    const prev = cards;
    const next = cards
      .map((c) => {
        if (c._id !== cardId) return c;
        const likes = Array.isArray(c.likes) ? [...c.likes] : [];
        const i = likes.indexOf(user._id);
        if (i > -1) likes.splice(i, 1); else likes.push(user._id);
        return { ...c, likes };
      })
      .filter((c) => Array.isArray(c.likes) && c.likes.includes(user._id));

    setCards(next);

    try {
      await axios.patch(`${API}/cards/${cardId}`, null, { headers: { "x-auth-token": token } });
    } catch (e) {
      console.error(e);
      setSnack("error", "Failed to add to favorites");
      setCards(prev);
    }
  };

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">You have to login to see favorites</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>My Favorite Cards</Typography>
      {cards.length === 0 ? (
        <Typography>No Favorite Cards yet !</Typography>
      ) : (
        <BCards cards={cards} toggleLike={toggleLike} isFavorite={isFavorite} />
      )}
    </Box>
  );
}