import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Box, Button, Card, CardContent, CircularProgress, Grid, TextField, Typography } from "@mui/material";
import { useSnack } from "../providers/SnackbarProvider";
import { useCurrentUser } from "../users/providers/UserProvider";
import ROUTES from "../routes/routesModel";
import cardSchema from "../validation/cardSchema";

const API2 = "https://monkfish-app-z9uza.ondigitalocean.app/bcard2"; 

export default function EditCardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const setSnack = useSnack();
  const { token, user } = useCurrentUser();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API2}/cards/${id}`);
      setForm({
        title: data?.title || "",
        subtitle: data?.subtitle || "",
        description: data?.description || "",
        phone: data?.phone || "",
        email: data?.email || "",
        web: data?.web || "",
        image: { url: data?.image?.url || "", alt: data?.image?.alt || "" },
        address: {
          state: data?.address?.state || "",
          country: data?.address?.country || "",
          city: data?.address?.city || "",
          street: data?.address?.street || "",
          houseNumber: String(data?.address?.houseNumber || ""),
          zip: String(data?.address?.zip || ""),
        },
      });
    } catch (e) {
      console.error(e);
      setSnack("error", e?.response?.data || "Failed to load card");
    } finally {
      setLoading(false);
    }
  }, [id, setSnack]);

  useEffect(() => { load(); }, [load]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !token) return setSnack("warning", "Please Log In");
    if (!user.isBusiness) return setSnack("warning", "Only Business User Can Edit");

    const { error } = cardSchema.validate(form, { abortEarly: false });
    if (error) {
      error.details.forEach((d) => setSnack("warning", d.message));
      return;
    }

    try {
      setSaving(true);
      await axios.put(`${API2}/cards/${id}`, form, { headers: { "x-auth-token": token } });
      setSnack("success", "Card Updated !");
      navigate(typeof ROUTES.cardInfo === "function" ? ROUTES.cardInfo(id) : `/cards/${id}`);
    } catch (e) {
      console.error(e);
      setSnack("error", e?.response?.data || "Update Failed !");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 1 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Edit Card</Typography>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
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
                <Button variant="outlined" onClick={() => navigate(-1)}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={saving}>{saving ? "Updating..." : "Update"}</Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}