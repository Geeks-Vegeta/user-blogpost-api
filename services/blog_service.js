const blogModel = require("../model/blog_model");
const moment = require("moment");
const mongoose = require("mongoose");
let ObjectId = mongoose.Types.ObjectId;

/**
 * 
 * @param {*} reqBody 
 * @param {*} userId 
 */
const create = async (reqBody, userId) => {
  await blogModel.create({
    ...reqBody,
    user_id: userId,
    createdAt: moment().unix(),
    updatedAt: moment().unix(),
  });
};

/**
 * 
 * @param {*} reqBody 
 * @returns 
 */
const blogExists = async (reqBody) => {
  let { title } = reqBody;
  return await blogModel.findOne({ title: title });
};

/**
 * 
 * @param {*} blogId 
 * @param {*} reqBody 
 * @returns 
 */
const update = async (blogId, reqBody) => {
  return await blogModel.findOneAndUpdate({ _id: blogId }, reqBody, {
    new: true,
  });
};

/**
 * 
 * @param {*} blogId 
 * @returns 
 */
const deleteBlog = async (blogId) => {
  return await blogModel.findOneAndDelete({ _id: blogId });
};

/**
 * 
 * @param {*} blogId 
 * @returns 
 */
const getBlog = async (blogId) => {
  return await blogModel.findOne({ _id: blogId }).lean();
};

/**
 * 
 * @param {*} blogId 
 * @returns 
 */
const readBlog = async (blogId) => {
  return await blogModel.aggregate([
    {
      $match: { _id: new ObjectId(blogId) },
    },
    {
      $lookup: {
        from: "users",
        let: { userId: "$user_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", { $toObjectId: "$$userId" }] },
            },
          },
        ],
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        title: 1,
        content: 1,
        createdAt: 1,
        updatedAt: 1,
        "author_name":{$concat:["$user.first_name"," ","$user.last_name"]},
      },
    },
  ]);
};

/**
 * 
 * @param {*} userId 
 * @returns 
 */
const getAllUserBlogs = async (userId) => {
    return await blogModel.aggregate([
      {
        $match: { user_id: new ObjectId(userId) },
      },
      {
        $lookup: {
          from: "users",
          let: { userId: "$user_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", { $toObjectId: "$$userId" }] },
              },
            },
          ],
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          title: 1,
          content: 1,
          createdAt: 1,
          updatedAt: 1,
          "author_name":{$concat:["$user.first_name"," ","$user.last_name"]},
        },
      },
    ]);
  };
  

module.exports = {
  create,
  blogExists,
  getBlog,
  update,
  deleteBlog,
  readBlog,
  getAllUserBlogs
};
