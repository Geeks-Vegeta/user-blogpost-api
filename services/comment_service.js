const commentModel = require("../model/comment_model");
const moment = require("moment");

/**
 *
 * @param {*} reqBody
 * @param {*} userId
 * @param {*} blogId
 * @returns
 */
const addComment = async (reqBody, userId, blogId) => {
  const comment = await commentModel.create({
    user_id: userId,
    blog_id: blogId,
    ...reqBody,
    createdAt: moment().unix(),
    updatedAt: moment().unix(),
  });
  return comment;
};

/**
 *
 * @param {*} reqBody
 * @param {*} commentId
 * @returns
 */
const update = async (reqBody, commentId) => {
  return await commentModel.findByIdAndUpdate({ _id: commentId }, reqBody, {
    new: true,
  });
};

/**
 *
 * @param {*} commentId
 * @returns
 */
const deleteComment = async (commentId) => {
  return await commentModel.findByIdAndDelete({ _id: commentId });
};

/**
 *
 * @param {*} commentId
 * @returns
 */
const getComment = async (commentId) => {
  return await commentModel.findOne({ _id: commentId }).lean();
};

module.exports = {
  addComment,
  update,
  getComment,
  deleteComment,
};
