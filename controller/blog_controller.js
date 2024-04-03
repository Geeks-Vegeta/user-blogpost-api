const sendResponse = require("../utils/response/send_response");
const ClientError = require("../utils/exceptions/client_error");
const ServerError = require("../utils/exceptions/server_error");
const blogService = require("../services/blog_service");
const logger = require("../utils/exceptions/logger");
const { validateBlog } = require("../validators/blog_validator");
const { validateObjectId } = require("../utils/obj_validator");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const createBlog = async (req, res, next) => {
  try {
    let userId = req.user.id;
    let reqBody = req.body;

    const { error } = validateBlog(reqBody);
    if (error) {
      throw new ClientError(400, error.message);
    }

    let blogExists = await blogService.blogExists(reqBody);
    if (blogExists) throw new ClientError(400, "blog already exists");

    await blogService.create(reqBody, userId);
    return sendResponse(req, res, next, "Blog created successfully");
  } catch (err) {
    if (err instanceof ClientError) {
      logger.exception(err, req);
      throw err;
    }
    throw new ServerError(500, "", err.message);
  }
};

const editBlog = async (req, res, next) => {
  try {
    let blogId = req.blog.id;
    let reqBody = req.body;

    const { error } = validateBlog(reqBody);
    if (error) {
      throw new ClientError(400, error.message);
    }
    await blogService.update(blogId, req.body);
    return sendResponse(req, res, next, "edited successfully");
  } catch (err) {
    if (err instanceof ClientError) {
      logger.exception(err, req);
      throw err;
    }
    throw new ServerError(500, "", err.message);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const blogIdCheck = async (req, res, next) => {
  try {
    let blogId = req.params.blogId;

    let checkBlog = await blogService.getBlog(blogId);
    if (!checkBlog) throw new ClientError(404, "no such blog exists");
    req.blog = { id: blogId, ...checkBlog };

    if (!validateObjectId(blogId)) {
      throw new ClientError(400, "Invalid Request Params");
    }
    next();
  } catch (err) {
    if (err instanceof ClientError) {
      logger.exception(err, req);
      throw err;
    }
    throw new ServerError(500, "", err.message);
  }
};

const readUserBlog = async (req, res, next) => {
  try {
    let { blogId } = req.params;
    let checkBlog = await blogService.getBlog(blogId);
    if (!checkBlog) throw new ClientError(404, "no such blog exists");

    let getBlog = await blogService.readBlog(blogId);
    return sendResponse(req, res, next, getBlog);
  } catch (err) {
    if (err instanceof ClientError) {
      logger.exception(err, req);
      throw err;
    }
    throw new ServerError(500, "", err.message);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    let blogId = req.blog.id;
    await blogService.deleteBlog(blogId);
    return sendResponse(req, res, next, "Blog deleted successfully");
  } catch (error) {
    if (err instanceof ClientError) {
      logger.exception(err, req);
      throw err;
    }
    throw new ServerError(500, "", err.message);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const allCurrentBlogs = async (req, res, next) => {
  try {
    let userId = req.user.id;
    let blogs = await blogService.getAllUserBlogs(userId);
    return sendResponse(req, res, next, blogs);
  } catch (err) {
    if (err instanceof ClientError) {
      logger.exception(err, req);
      throw err;
    }
    throw new ServerError(500, "", err.message);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const allUserBlogs = async (req, res, next) => {
  try {
    let { userId } = req.params;

    let blogs = await blogService.getAllUserBlogs(userId);
    return sendResponse(req, res, next, blogs);
  } catch (err) {
    if (err instanceof ClientError) {
      logger.exception(err, req);
      throw err;
    }
    throw new ServerError(500, "", err.message);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const userBlogCheck = async (req, res, next) => {
  try {
    let blogUserId = req.blog.user_id;
    let userId = req.user.id;
    if (userId !== blogUserId.toString()) {
      throw new ClientError(
        403,
        "You are not authorized to perform this action"
      );
    }
    next();
  } catch (err) {
    if (err instanceof ClientError) {
      logger.exception(err, req);
      throw err;
    }
    throw new ServerError(500, "", err.message);
  }
};

module.exports = {
  createBlog,
  editBlog,
  blogIdCheck,
  userBlogCheck,
  deleteBlog,
  readUserBlog,
  allCurrentBlogs,
  allUserBlogs,
};
