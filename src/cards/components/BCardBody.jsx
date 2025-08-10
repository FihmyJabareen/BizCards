import { CardContent, Divider, Typography } from "@mui/material";
import PropTypes from "prop-types";

function BCardBody({ title, subtitle, phone, city, bizNumber }) {
  return (
    <CardContent>
      <Typography variant="h5">{title}</Typography>
      <Typography variant="h6">{subtitle}</Typography>
      <Divider sx={{ marginY: 1 }} />
      <Typography variant="body2">
        <strong>Phone:</strong> {phone}
      </Typography>
      <Typography variant="body2">
        <strong>Address:</strong> {city}
      </Typography>
      <Typography variant="body2">Card Number: {bizNumber}</Typography>
    </CardContent>
  );
}

BCardBody.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  bizNumber: PropTypes.string.isRequired,
};

export default BCardBody;
