import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
} from "@mui/material";
import BCardFooter from "./BCardFooter";
import ROUTES from "../../routes/routesModel";

export default function BCard({
  card,
  toggleLike,
  isFavorite,
  canEdit = false,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();

  const title = card?.title || "Untitled";
  const subtitle = card?.subtitle || "";
  const imgUrl = card?.image?.url || "https://via.placeholder.com/600x300?text=No+Image";
  const imgAlt = card?.image?.alt || title;

  const addressText = useMemo(() => {
    const a = card?.address || {};
    return [a.street, a.houseNumber, a.city, a.state, a.country, a.zip]
      .filter(Boolean)
      .join(", ");
  }, [card]);

  const goToDetails = () => {
    const to = typeof ROUTES.cardInfo === "function" ? ROUTES.cardInfo(card._id) : `/cards/${card._id}`;
    navigate(to);
  };

  return (
    <Card sx={{ width: 280, height: 380, display: "flex", flexDirection: "column" }}>
      <CardActionArea onClick={goToDetails}>
        <CardMedia sx={{ width: "100%", aspectRatio: "16/9", objectFit: "cover" }}
          component="img"
          height="160"
          image={imgUrl}
          alt={imgAlt}
          onError={(e) => {
            e.currentTarget.src = "https://placehold.co/600x400?text=No+Image+Available";
          }}
          
        />
        <CardContent>
          <Typography variant="h6" noWrap title={title}>{title}</Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" noWrap title={subtitle}>
              {subtitle}
            </Typography>
          )}
          {addressText && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary" noWrap title={addressText}>
                {addressText}
              </Typography>
            </Box>
          )}
        </CardContent>
      </CardActionArea>

      <Box sx={{ px: 2, pb: 1, mt: "auto" }}>
        <BCardFooter
          card={card}
          toggleLike={toggleLike}
          isFavorite={isFavorite}
          canEdit={canEdit}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </Box>
    </Card>
  );
}
