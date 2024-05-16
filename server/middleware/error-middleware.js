const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Backed Error";
  const extraDetails = err.extraDetails || "Error from Backend";
  const status = err.status || "error";

  return res.status(statusCode).json({ status, message, extraDetails });
};

const asyncError = (passedFunction) => (req, res, next) => {
  Promise.resolve(passedFunction(req, res, next)).catch(next);
};

module.exports = { errorMiddleware, asyncError };
