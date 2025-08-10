import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { useSnack } from "../providers/SnackbarProvider";
import { useCurrentUser } from "../users/providers/UserProvider";
import ROUTES from "../routes/routesModel";

const API = "https://monkfish-app-z9uza.ondigitalocean.app/bcard2"; 

export default function CardDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const setSnack = useSnack();
  const { user } = useCurrentUser();

  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/cards/${id}`);
      setCard(data);
    } catch (e) {
      console.error(e);
      setSnack("error", e?.response?.data || "Failed to load card");
    } finally {
      setLoading(false);
    }
  }, [id, setSnack]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!card) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Card Not Found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              sx={{ height: 300, objectFit: "cover" }}
              image={card?.image?.url || "https://via.placeholder.com/600x300?text=No+Image"}
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/600x300?text=No+Image";
              }}
              alt={card?.image?.alt || card?.title || "Business image"}
            />
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {card.title}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {card.subtitle}
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                {card.description}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end" }}>
              {user?.isBusiness && (
                <Button
                  variant="outlined"
                  onClick={() =>
                    navigate(
                      typeof ROUTES.editCard === "function" ? ROUTES.editCard(id) : `/cards/edit/${id}`
                    )
                  }
                >
                  Edit
                </Button>
              )}
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Card Details
              </Typography>
              <Typography>📞 {card.phone}</Typography>
              <Typography>✉️ {card.email}</Typography>
              {card.web && (
                <Typography>
                  🌐{" "}
                  <a href={card.web} target="_blank" rel="noreferrer">
                    {card.web}
                  </a>
                </Typography>
              )}

              <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>
                Address
              </Typography>
              <Typography>
                {[
                  card?.address?.street,
                  card?.address?.houseNumber,
                  card?.address?.city,
                  card?.address?.state,
                  card?.address?.country,
                  card?.address?.zip,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Button variant="contained" onClick={() => navigate(ROUTES.root)}>
          Home Page
        </Button>
      </Box>
    </Box>
  );
}
