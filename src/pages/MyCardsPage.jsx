import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Box, CircularProgress, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BCards from "../cards/components/BCards";
import { useCurrentUser } from "../users/providers/UserProvider";
import { useSnack } from "../providers/SnackbarProvider";
import ROUTES from "../routes/routesModel";

const API = "https://monkfish-app-z9uza.ondigitalocean.app/bcard2"; 

export default function MyCardsPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);
  const { user, token } = useCurrentUser();
  const setSnack = useSnack();
  const navigate = useNavigate();

  const loadMine = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/cards`);
      const mine = data.filter((c) => c.user_id === user._id);
      setCards(mine);
    } catch (e) {
      console.error(e);
      setSnack("error", "Failed to load my cards");
    } finally {
      setLoading(false);
    }
  }, [user, setSnack]);

  useEffect(() => { loadMine(); }, [loadMine]);

  const onEdit = (card) => {
    const to = typeof ROUTES.editCard === "function" ? ROUTES.editCard(card._id) : `/cards/edit/${card._id}`;
    navigate(to);
  };

  const onDelete = async (cardId) => {
    if (!token) return setSnack("warning", "Login to Delete");
    try {
      setReloading(true);
      await axios.delete(`${API}/cards/${cardId}`, { headers: { "x-auth-token": token } });
      setCards((prev) => prev.filter((c) => c._id !== cardId));
      setSnack("success", "Card Deleted !");
    } catch (e) {
      console.error(e);
      setSnack("error", e?.response?.data || "Delete Failed");
    } finally {
      setReloading(false);
    }
  };

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Please login to see your cards</Typography>
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
    <Box sx={{ p: 2, pb: 8 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5">My Cards</Typography>
        {user.isBusiness && (
          <Button
            variant="contained"
            onClick={() => navigate(ROUTES.createCard)}
          >
            Create new card
          </Button>
        )}
      </Stack>

      {cards.length === 0 ? (
        <Typography>No Cards Yet</Typography>
      ) : (
        <BCards
          cards={cards}
          onEdit={onEdit}       
          onDelete={onDelete}  
          spacing={2}
        />
      )}
    </Box>
  );
}
