import { Grid, FormControlLabel, Checkbox, TextField } from "@mui/material";

import useForm from "../../hooks/useForm";
import Form from "../../components/Form";
import axios from "axios";
import signupSchema from "../models/signupSchema";
import initialSignupForm from "../helpers/initialForms/initialSignupForm";
import normalizeUser from "../helpers/normalization/normalizeUser";

const handleSignup = async (userDetails) => {
  const userDetailsForServer = normalizeUser(userDetails);
  try {
    const response = await axios.post(
      "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users",
      userDetailsForServer
    );
    console.log(response);
  } catch (error) {
    console.log(error);
    if (error.response) {
      alert(error.response.data);
    }
  }
};

function RegisterForm() {
  const { formDetails, errors, handleChange, handleSubmit } = useForm(
    initialSignupForm,
    signupSchema,
    handleSignup
  );

  return (
    <Form
      onSubmit={handleSubmit}
      onReset={() => {}}
      title={"sign up form"}
      styles={{ maxWidth: 640 }}
    >
      <TextField
        name="first"
        label="first name"
        error={errors.first}
        onChange={handleChange}
        value={formDetails.first}
        sm={6}
      />
      <TextField
        name="middle"
        label="middle name"
        error={errors.middle}
        onChange={handleChange}
        value={formDetails.middle}
        sm={6}
        required={false}
      />
      <TextField
        name="last"
        label="last name"
        error={errors.last}
        onChange={handleChange}
        value={formDetails.last}
        sm={6}
      />
      <TextField
        name="phone"
        label="phone"
        type="phone"
        error={errors.phone}
        onChange={handleChange}
        value={formDetails.phone}
        sm={6}
      />
      <TextField
        name="email"
        label="email"
        type="email"
        error={errors.email}
        onChange={handleChange}
        value={formDetails.email}
        sm={6}
      />
      <TextField
        name="password"
        label="password"
        type="password"
        error={errors.password}
        onChange={handleChange}
        value={formDetails.password}
        sm={6}
      />
      <TextField
        name="url"
        label="image url"
        error={errors.url}
        onChange={handleChange}
        value={formDetails.url}
        sm={6}
        required={false}
      />
      <TextField
        name="alt"
        label="image alt"
        error={errors.alt}
        onChange={handleChange}
        value={formDetails.alt}
        sm={6}
        required={false}
      />
      <TextField
        name="state"
        label="state"
        error={errors.state}
        onChange={handleChange}
        value={formDetails.state}
        sm={6}
        required={false}
      />
      <TextField
        label="country"
        name="country"
        error={errors.country}
        onChange={handleChange}
        value={formDetails.country}
        sm={6}
      />
      <TextField
        name="city"
        label="city"
        error={errors.city}
        onChange={handleChange}
        value={formDetails.city}
        sm={6}
      />
      <TextField
        name="street"
        label="street"
        error={errors.street}
        onChange={handleChange}
        value={formDetails.street}
        sm={6}
      />
      <TextField
        name="houseNumber"
        label="house Number"
        type="number"
        error={errors.houseNumber}
        onChange={handleChange}
        value={formDetails.houseNumber}
        sm={6}
      />
      <TextField
        name="zip"
        label="zip"
        error={errors.zip}
        onChange={handleChange}
        value={formDetails.zip}
        sm={6}
        required={false}
      />
    </Form>
  );
}

export default RegisterForm;
