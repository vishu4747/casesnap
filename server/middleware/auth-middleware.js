const User = require("../models/users");
const CustomError = require("../utils/CustomError");

const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      next(new CustomError("Please provide token", 401));
    }
    const tokenData = jwt.verify(token, "ABCDEFGH");
    const userData = await User.findOne({ email: tokenData.email });
    if (!userData) next(new CustomError("Invalid token", 401)); //for bad request
    req.user = userData;
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = isAuthenticated;
