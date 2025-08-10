import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useSnack } from "../providers/SnackbarProvider";
import ROUTES from "../routes/routesModel";
import registerSchema from "../validation/registerSchema";

const API = "https://monkfish-app-z9uza.ondigitalocean.app/bcard2"; 

export default function RegisterPage() {
  const navigate = useNavigate();
  const setSnack = useSnack();

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: { first: "", middle: "", last: "" },
    phone: "",
    email: "",
    password: "",
    image: { url: "", alt: "" },
    address: { state: "", country: "", city: "", street: "", houseNumber: "", zip: "" },
    isBusiness: false,
  });

  const onChange = (path) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
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
    const { error } = registerSchema.validate(form, { abortEarly: false });
    if (error) {
      error.details.forEach((d) => setSnack("warning", d.message));
      return;
    }
    try {
      setSaving(true);
      await axios.post(`${API}/users`, form);
      setSnack("success", "Register Successful , You can login now ! ");
      navigate(ROUTES.login);
    } catch (err) {
      console.error(err);
      setSnack("error", err?.response?.data || "Register Failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 1 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Register</Typography>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField label="First Name" fullWidth value={form.name.first} onChange={onChange("name.first")} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Middle" fullWidth value={form.name.middle} onChange={onChange("name.middle")} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Last Name" fullWidth value={form.name.last} onChange={onChange("name.last")} />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField label="Phone" fullWidth value={form.phone} onChange={onChange("phone")} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Email" type="email" fullWidth value={form.email} onChange={onChange("email")} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Password" type="password" fullWidth value={form.password} onChange={onChange("password")} helperText="לפחות 9 תווים עם אות קטנה/גדולה, מספר וסימן" />
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
              <FormControlLabel
                control={<Checkbox checked={form.isBusiness} onChange={onChange("isBusiness")} />}
                label="Business Acount"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                <Button variant="outlined" onClick={() => navigate(-1)} disabled={saving}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={saving}>{saving ? "Submitting..." : "Submit"}</Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
