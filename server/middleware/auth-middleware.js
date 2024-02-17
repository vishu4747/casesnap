const CustomError = require("../utils/CustomError");

const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.token;
    console.log(token);
    if (!token) {
      next(new CustomError("Please provide token", 400));
    }
    const tokenData = jwt.verify(token, "ABCDEFGH");
    req.user = tokenData;
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = isAuthenticated;
