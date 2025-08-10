import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import FormButton from "./FormButton";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import LoopIcon from "@mui/icons-material/Loop";

const Form = ({
  title = "",
  onSubmit,
  onReset,
  to = "/",
  color = "inherit",
  spacing = 1,
  styles = {},
  children,
}) => {
  const navigate = useNavigate();

  return (
  <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
    <Box sx={{ width: "100%", maxWidth: 640, mx: "auto", ...styles, "& .MuiFormControl-root": { width: "100%" }, "& .MuiTextField-root": { mx: "auto" }, "& .MuiInputBase-input": { textAlign: "center" }, "& .MuiFormLabel-root": { textAlign: "center", width: "100%" }, "& .MuiFormControlLabel-root": { mx: "auto", display: "flex", justifyContent: "center" } }}>
<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>

    <Box
      component="form"
      color={color}
      sx={{ mt: 2, p: { xs: 1, sm: 2 }, ...styles }}
      onSubmit={onSubmit}
      autoComplete="off"
      noValidate
    >
      <Typography align="center" variant="h5" component="h1" mb={2}>
        {title.toUpperCase()}
      </Typography>

      <Grid container justifyContent="center" alignItems="center" spacing={spacing}>
        {children}
      </Grid>

      <Grid container justifyContent="center" alignItems="center" spacing={1} my={2} direction="row" width="100">
        <Grid item xs={12} sm={6}>
          <FormButton
            node="cancel"
            color="error"
            component="div"
            variant="outlined"
            onClick={() => navigate(to)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormButton
            node={<LoopIcon />}
            variant="outlined"
            component="div"
            onClick={onReset}
          />
        </Grid>
        <Grid item xs={12}>
          <FormButton node="Submit" onClick={onSubmit} size="large" />
        </Grid>
      </Grid>
    </Box>
      </Box>
  
    </Box>
  </Box>
);
};

export default Form;
