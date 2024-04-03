require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const moment = require("moment");
const errorHandler = require("./utils/exceptions/error_handler");
const userRouter = require("./routes/auth_routes");
const blogRouter = require("./routes/blog_routes");
require("./database/connection");



morgan.token("time", (req) => {
  return moment().toLocaleString();
});
app.use(morgan(":time | :method :url :status :response-time ms"));
app.use(cors());
app.use(helmet());
app.use(
  express.json({
    limit: "1mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "1mb", extended: false }));

app.use("/healthcheck", (req, res, next) => {
    res.send("ok");
  });
  
app.use("/api/user/auth", userRouter);
app.use("/api/blog", blogRouter);

app.use(errorHandler);
app.use((err, req, res, next) => {
  // Send a JSON response with the error message and status code
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    data: {
      item: {},
    },
    status: {
      type: "error",
      message: "Something went wrong. Please try again later.",
      description: "Something went wrong",
    },
  });
});

let port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
