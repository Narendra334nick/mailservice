// ErrorHandler.js
const errorHandler = (err, req, res, next) => {
  const errStatus = err.statusCode || 400;
  const errFromSql =
    err && err.message
      ? err.message
      : err && typeof err !== "object"
      ? err
      : "Something went wrong";
  const errMsg = errFromSql || err.message || "Something went wrong";
  res.status(errStatus).json({
    state: -1,
    message: errMsg,
    data: [],
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
    time: new Date(),
  });
  next();
};

export default errorHandler;
