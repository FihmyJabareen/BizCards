import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";


export default function BCardFooter({
  card,
  onLike,
  toggleLike,
  isFavorite,
  canEdit = false,
  onEdit,
  onDelete,
}) {
  const handleLike = () => {
    const fn = onLike || toggleLike; 
    if (typeof fn === "function" && card?._id) fn(card._id);
  };

  const likedByMe = typeof isFavorite === "function" ? isFavorite(card?._id) : false;
  const likesCount = Array.isArray(card?.likes) ? card.likes.length : 0;

  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1 }}>
     
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Tooltip title={likedByMe ? "הסר לייק" : "הוסף לייק"}>
          <IconButton
            onClick={handleLike}
            size="small"
            color={likedByMe ? "error" : "default"}
            aria-label="like"
          >
            <FavoriteIcon />
          </IconButton>
        </Tooltip>
        <Typography variant="body2">{likesCount}</Typography>
      </Box>

      {canEdit && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {typeof onEdit === "function" && (
            <Tooltip title="עריכה">
              <IconButton size="small" onClick={() => onEdit(card)} aria-label="edit">
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          {typeof onDelete === "function" && (
            <Tooltip title="מחיקה">
              <IconButton size="small" onClick={() => onDelete(card?._id)} aria-label="delete">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}
    </Box>
  );
}
