import Joi from "joi";

const registerSchema = Joi.object({
    name: Joi.object({
        first: Joi.string().min(2).max(256).required(),
        middle: Joi.string().allow(""),
        last: Joi.string().min(2).max(256).required(),
    }),
    phone: Joi.string().min(9).max(20).required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&])[A-Za-z\d!@#$%^&]{9,}$/)
        .required(),
    image: Joi.object({
        url: Joi.string().uri().allow(""),
        alt: Joi.string().allow("")
    }),
    address: Joi.object({
        state: Joi.string().allow(""),
        country: Joi.string().allow(""),
        city: Joi.string().allow(""),
        street: Joi.string().allow(""),
        houseNumber: Joi.alternatives().try(Joi.string(), Joi.number()).allow(""),
        zip: Joi.alternatives().try(Joi.string(), Joi.number()).allow("")
    }),
    isBusiness: Joi.boolean().required(),
});

export default registerSchema;
