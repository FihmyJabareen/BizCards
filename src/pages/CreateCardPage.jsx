import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useSnack } from "../providers/SnackbarProvider";
import { useCurrentUser } from "../users/providers/UserProvider";
import ROUTES from "../routes/routesModel";
import cardSchema from "../validation/cardSchema";

const API = "https://monkfish-app-z9uza.ondigitalocean.app/bcard2"; 

export default function CreateCardPage() {
  const navigate = useNavigate();
  const setSnack = useSnack();
  const { token, user } = useCurrentUser();

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    phone: "",
    email: "",
    web: "",
    image: { url: "", alt: "" },
    address: { state: "", country: "", city: "", street: "", houseNumber: "", zip: "" },
  });

  const onChange = (path) => (e) => {
    const value = e.target.value;
    setForm((prev) => {
      const next = { ...prev };
      const keys = path.split(".");
      let ref = next;
      for (let i = 0; i < keys.length - 1; i++) ref = ref[keys[i]];
      ref[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const validate = () => {
    const { error } = cardSchema.validate(form, { abortEarly: false });
    if (!error) return null;
    error.details.forEach((d) => setSnack("warning", d.message));
    return error;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user || !token) return setSnack("warning", "Please Login");
    if (!user.isBusiness) return setSnack("warning", "Only Business User Can Create A New Card");

    if (validate()) return;

    try {
      setSaving(true);
      const { data } = await axios.post(`${API}/cards`, { ...form }, {
        headers: { "x-auth-token": token },
      });
      setSnack("success", "New Card Created !");
      const newId = data?._id;
      if (newId) {
        navigate(typeof ROUTES.cardInfo === "function" ? ROUTES.cardInfo(newId) : `/cards/${newId}`);
      } else {
        navigate(ROUTES.myCards);
      }
    } catch (e) {
      console.error(e);
      setSnack("error", e?.response?.data || "Create Failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ p: 1 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Create a new card</Typography>
      <Card sx={{ maxWidth: 640, width: "100%", mx: "auto" }}>
        <CardContent>
          <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField label="Title" fullWidth value={form.title} onChange={onChange("title")} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Subtitle" fullWidth value={form.subtitle} onChange={onChange("subtitle")} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Description" fullWidth multiline minRows={3} value={form.description} onChange={onChange("description")} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Phone" fullWidth value={form.phone} onChange={onChange("phone")} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Email" type="email" fullWidth value={form.email} onChange={onChange("email")} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Website" fullWidth value={form.web} onChange={onChange("web")} />
            </Grid>

            <Grid item xs={12} md={8}>
              <TextField label="Image URL" fullWidth value={form.image.url} onChange={onChange("image.url")} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Image Alt" fullWidth value={form.image.alt} onChange={onChange("image.alt")} />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField label="Country" fullWidth value={form.address.country} onChange={onChange("address.country")} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="City" fullWidth value={form.address.city} onChange={onChange("address.city")} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Street" fullWidth value={form.address.street} onChange={onChange("address.street")} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="House No." fullWidth value={form.address.houseNumber} onChange={onChange("address.houseNumber")} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="State" fullWidth value={form.address.state} onChange={onChange("address.state")} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="ZIP" fullWidth value={form.address.zip} onChange={onChange("address.zip")} />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                <Button variant="outlined" onClick={() => navigate(-1)} disabled={saving}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={saving}>{saving ? <CircularProgress size={20} /> : "Create"}</Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}