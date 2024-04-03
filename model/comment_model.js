let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let modelName = require("../utils/enums/model_names");

const commentSchema = new Schema(
  {
    comment: { type: String, required: true },
    user_id:  mongoose.Types.ObjectId,
    blog_id:  mongoose.Types.ObjectId,
  },
  { strict: false }
);

const commentModel = mongoose.model(modelName.COMMENT, commentSchema);
module.exports = commentModel;
