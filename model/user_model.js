let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let modelName = require("../utils/enums/model_names");

const userSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    date_of_birth: { type: Date },
    profile_picture: { type: String },
    password: { type: String, required: true },
  },
  { strict: false }
);

const userModel = mongoose.model(modelName.USER, userSchema);
module.exports = userModel;
