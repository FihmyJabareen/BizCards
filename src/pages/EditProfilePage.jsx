import { useEffect, useState, useCallback } from "react";
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
import userSchema from "../validation/userSchema"; 

const API = "https://monkfish-app-z9uza.ondigitalocean.app/bcard2"; 

export default function EditProfilePage() {
  const { user, token, setUser } = useCurrentUser();
  const setSnack = useSnack();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: { first: "", middle: "", last: "" },
    phone: "",
    email: "",
    image: { url: "", alt: "" },
    address: { state: "", country: "", city: "", street: "", houseNumber: "", zip: "" },
  });

  const load = useCallback(async () => {
    if (!user || !token) return setLoading(false);
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/users/${user._id}`, {
        headers: { "x-auth-token": token },
      });
      setForm({
        name: {
          first: data?.name?.first || "",
          middle: data?.name?.middle || "",
          last: data?.name?.last || "",
        },
        phone: data?.phone || "",
        email: data?.email || "",
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
      setSnack("error", e?.response?.data || "Profile loading failed");
    } finally {
      setLoading(false);
    }
  }, [user, token, setSnack]);

  useEffect(() => {
    load();
  }, [load]);

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

    const { error } = userSchema.validate(form, { abortEarly: false });
    if (error) {
      error.details.forEach((d) => setSnack("warning", d.message));
      return;
    }

    try {
      setSaving(true);
      const { data } = await axios.put(
        `${API}/users/${user._id}`,
        { ...form },
        { headers: { "x-auth-token": token } }
      );
      
      if (typeof setUser === "function") setUser(data);
      setSnack("success", "Updated Successfuly");
    } catch (err) {
      console.error(err);
      setSnack("error", err?.response?.data || "Update Failed");
    } finally {
      setSaving(false);
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
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 1, pb: 8 }}>
      <Typography variant="h5" sx={{ mb: 2 }}> Edit Profile </Typography>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                label="First Name"
                fullWidth
                value={form.name.first}
                onChange={onChange("name.first")}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Middle"
                fullWidth
                value={form.name.middle}
                onChange={onChange("name.middle")}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Last Name"
                fullWidth
                value={form.name.last}
                onChange={onChange("name.last")}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Phone"
                fullWidth
                value={form.phone}
                onChange={onChange("phone")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={form.email}
                onChange={onChange("email")}
              />
            </Grid>

            <Grid item xs={12} md={8}>
              <TextField
                label="Image URL"
                fullWidth
                value={form.image.url}
                onChange={onChange("image.url")}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Image Alt"
                fullWidth
                value={form.image.alt}
                onChange={onChange("image.alt")}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Country"
                fullWidth
                value={form.address.country}
                onChange={onChange("address.country")}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="City"
                fullWidth
                value={form.address.city}
                onChange={onChange("address.city")}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Street"
                fullWidth
                value={form.address.street}
                onChange={onChange("address.street")}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="House No."
                fullWidth
                value={form.address.houseNumber}
                onChange={onChange("address.houseNumber")}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="State"
                fullWidth
                value={form.address.state}
                onChange={onChange("address.state")}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="ZIP"
                fullWidth
                value={form.address.zip}
                onChange={onChange("address.zip")}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                <Button variant="outlined" onClick={() => window.history.back()} disabled={saving}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={saving}>
                  {saving ? "Updating..." : "Update"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Box sx={{ mt: 2 }}>
        <Button variant="text" onClick={() => (window.location.href = ROUTES.root)}> Back to Home Page </Button>
      </Box>
    </Box>
  );
}
