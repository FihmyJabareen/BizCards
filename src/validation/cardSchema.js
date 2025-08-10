import Joi from "joi";

const cardSchema = Joi.object({
    title: Joi.string().min(2).max(256).required(),
    subtitle: Joi.string().min(2).max(256).required(),
    description: Joi.string().min(2).max(1024).required(),
    phone: Joi.string().min(9).max(20).required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    web: Joi.string().uri().allow(""), 
    image: Joi.object({
        url: Joi.string().uri().allow(""),
        alt: Joi.string().allow("")
    }),
    address: Joi.object({
        state: Joi.string().allow(""),
        country: Joi.string().required(),
        city: Joi.string().required(),
        street: Joi.string().required(),
        houseNumber: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
        zip: Joi.alternatives().try(Joi.string(), Joi.number()).allow("")
    }),
}).required();

export default cardSchema;
