import { Grid, Typography, Box } from "@mui/material";
import BCard from "./BCard";


export default function BCards({
  cards = [],
  toggleLike,
  isFavorite,
  onEdit,
  onDelete,
  emptyText = "No Cards To Display",
  spacing = 2,
}) {
  if (!cards || cards.length === 0) {
    return (
      <Box sx={{ mx: "auto", maxWidth: 1200, px: 2 }} >
        <Typography>{emptyText}</Typography>
      </Box>
    );
  }

  return (
    <Grid container justifyContent="center" alignItems="stretch" spacing={2} >
      {cards.map((card) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={card._id} >
          <BCard
            card={card}
            toggleLike={toggleLike}
            isFavorite={isFavorite}
            canEdit={typeof onEdit === "function" || typeof onDelete === "function"}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </Grid>
      ))}
    </Grid>
  );
}
