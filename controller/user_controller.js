const sendResponse = require("../utils/response/send_response");
const ClientError = require("../utils/exceptions/client_error");
const ServerError = require("../utils/exceptions/server_error");
const userService = require("../services/user_service");
const logger = require("../utils/exceptions/logger");
const {
  validateRegister,
  validateLogin,
} = require("../validators/user_validator");

const register = async (req, res, next) => {
  try {
    let reqBody = req.body;

    const { error } = validateRegister(req.body);
    if (error) {
      throw new ClientError(400, error.message);
    }

    let user = await userService.checkUser(reqBody);
    if (user) throw new ClientError(404, "user already registered");
    await userService.registerUser(reqBody);
    return sendResponse(req, res, next, {
      message: "user created successfully",
    });
  } catch (err) {
    if (err instanceof ClientError) {
      logger.exception(err, req);
      throw err;
    }
    throw new ServerError(500, "", err.message);
  }
};

const login = async (req, res, next) => {
  try {
    let { password } = req.body;
    const { error } = validateLogin(req.body);
    if (error) {
      throw new ClientError(400, error.message);
    }
    let user = await userService.checkUser(req.body);
    if (!user) throw new ClientError(404, "user not found");

    let comparePassword = await userService.isAuthenticPassword(
      password,
      user.password
    );
    if (!comparePassword) throw new ClientError(400, "invalid password");

    let token = await userService.generateToken(user._id);
    return sendResponse(req, res, next, token);
  } catch (err) {
    if (err instanceof ClientError) {
      logger.exception(err, req);
      throw err;
    }
    throw new ServerError(500, "", err.message);
  }
};

module.exports = {
  register,
  login,
};
