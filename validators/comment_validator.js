const Joi = require("joi");
const JoiOptions = require("./validator_options/joi_options.json");

/**
 *
 * @param {*} reqBody
 * @returns
 */
function validateComment(reqBody) {
  const commentObj = Joi.object({
    comment: Joi.string().label("comment").required().messages({
      "string.base": `comment must be a type of string`,
      "string.min": `comment should have minimum length of {#limit}`,
      "string.max": `comment can not be more than {#limit}`,
    }),
  });

  return commentObj.validate(reqBody, JoiOptions);
}

module.exports = { validateComment };
