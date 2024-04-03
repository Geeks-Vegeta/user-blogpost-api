let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let modelName = require("../utils/enums/model_names");

const blogSchema = new Schema(
  {
    title: { type: String, required: true, unique: true},
    content: { type: String, required: true },
    user_id:  mongoose.Types.ObjectId,
    
  },
  { strict: false }
);

const blogModel = mongoose.model(modelName.BLOG, blogSchema);
module.exports = blogModel;
