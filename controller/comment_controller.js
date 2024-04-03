const sendResponse = require("../utils/response/send_response");
const ClientError = require("../utils/exceptions/client_error");
const ServerError = require("../utils/exceptions/server_error");
const commentService = require("../services/comment_service");
const logger = require("../utils/exceptions/logger");
const { validateComment } = require("../validators/comment_validator");
const { validateObjectId } = require("../utils/obj_validator");

const create = async (req, res, next) => {
    try {
        let userId = req.user.id;
        let { blogId } = req.params;
        let reqBody = req.body;

        const { error } = validateComment(reqBody);
        if (error) {
            throw new ClientError(400, error.message);
        }

        await commentService.addComment(req.body, userId, blogId);
        return sendResponse(req, res, next, "comment added");
    } catch (err) {
        if (err instanceof ClientError) {
            logger.exception(err, req);
            throw err;
        }
        throw new ServerError(500, "", err.message);
    }
};

const deleteComment = async (req, res, next) => {
    try {
        let commentId = req.comment.id;
        await commentService.deleteComment(commentId);
        return sendResponse(req, res, next, "deleted successfully");

    } catch (err) {
        if (err instanceof ClientError) {
            logger.exception(err, req);
            throw err;
        }
        throw new ServerError(500, "", err.message);
    }
};

const editComment = async (req, res, next) => {
    try {
        let commentId = req.comment.id;
        let reqBody = req.body;

        const { error } = validateComment(reqBody);
        if (error) {
            throw new ClientError(400, error.message);
        }
        await commentService.update(reqBody, commentId);
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
const userCommentCheck = async (req, res, next) => {
    try {
        let commentUserId = req.comment.user_id;
        let userId = req.user.id;
        if (userId !== commentUserId.toString()) {
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

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const commentIdCheck = async (req, res, next) => {
    try {
        let commentId = req.params.commentId;

        let checkComment = await commentService.getComment(commentId);
        if (!checkComment) throw new ClientError(404, "no such comment exists");
        req.comment = { id: commentId, ...checkComment };

        if (!validateObjectId(commentId)) {
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

module.exports = {
    create,
    userCommentCheck,
    commentIdCheck,
    editComment,
    deleteComment
};
