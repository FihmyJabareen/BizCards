import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";

export default function AboutPage() {
  return (
    <Box sx={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
      <Box sx={{ maxWidth: 800, textAlign: "center" }}>
        <Typography variant="h4" sx={{ mb: 2 }}>About BizCards</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          BizCards is a modern web application designed to make managing and discovering business cards simple and efficient.
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          With BizCards, you can:
        </Typography>
        <List sx={{ textAlign: "left", display: "inline-block" }}>
          <ListItem>
            <ListItemText primary="Browse and search for business cards without signing in." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Create, edit, and delete your own cards as a registered business user." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Save your favorite cards for quick access later." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Enjoy a responsive and user-friendly interface that works on desktop, tablet, and mobile." />
          </ListItem>
        </List>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Whether you’re a professional looking to showcase your work, or someone searching for business contacts,
          BizCards provides the tools you need — all in one place.
        </Typography>
      </Box>
    </Box>
  );
}
