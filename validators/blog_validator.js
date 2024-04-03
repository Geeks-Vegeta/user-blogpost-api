const Joi = require("joi");
const JoiOptions = require("./validator_options/joi_options.json");

/**
 *
 * @param {*} reqBody
 * @returns
 */
function validateBlog(reqBody) {
  const blogObj = Joi.object({
    title: Joi.string().label("title").min(10).max(50).required().messages({
      "string.base": `title must be a type of string`,
      "string.min": `title should have minimum length of {#limit}`,
      "string.max": `title can not be more than {#limit}`,
    }),
    content: Joi.string().min(100).label("content").required().messages({
      "string.base": `content must be a type of string`,
      "string.min": `content should have minimum length of {#limit}`,
      "string.max": `content can not be more than {#limit}`,
    }),
  });

  return blogObj.validate(reqBody, JoiOptions);
}

module.exports = { validateBlog };
