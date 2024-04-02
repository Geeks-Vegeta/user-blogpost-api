const Joi = require("joi");
const JoiOptions = require("./validator_options/joi_options.json");

/**
 *
 * @param {*} reqBody
 * @returns
 */
function validateRegister(reqBody) {
  const registerObj = Joi.object({
    first_name: Joi.string()
      .min(6)
      .max(20)
      .label("first_name")
      .required()
      .messages({
        "string.base": `first_name must be a type of string`,
        "string.min": `first_name should have minimum length of {#limit}`,
        "string.max": `first_name can not be more than {#limit}`,
      }),
    last_name: Joi.string()
      .min(6)
      .max(20)
      .label("last_name")
      .required()
      .messages({
        "string.base": `last_name must be a type of string`,
        "string.min": `last_name should have minimum length of {#limit}`,
        "string.max": `last_name can not be more than {#limit}`,
      }),
    email: Joi.string().email().label("email").required().messages({
      "string.base": `email must be a type of string`,
    }),
    password: Joi.string()
      .min(6)
      .max(20)
      .label("password")
      .required()
      .messages({
        "string.base": `password must be a type of string`,
        "string.min": `password should have minimum length of {#limit}`,
        "string.max": `password can not be more than {#limit}`,
      }),
  });

  return registerObj.validate(reqBody, JoiOptions);
}

/**
 *
 * @param {*} reqBody
 * @returns
 */
function validateLogin(reqBody) {
  const loginObj = Joi.object({
    email: Joi.string().email().label("email").required().messages({
      "string.base": `email must be a type of string`,
    }),
    password: Joi.string()
      .min(6)
      .max(20)
      .label("password")
      .required()
      .messages({
        "string.base": `password must be a type of string`,
        "string.min": `password should have minimum length of {#limit}`,
        "string.max": `password can not be more than {#limit}`,
      }),
  });

  return loginObj.validate(reqBody, JoiOptions);
}

module.exports = { validateRegister, validateLogin };
