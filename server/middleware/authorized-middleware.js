const CustomError = require("../utils/CustomError");

const isAuthorized = (req, res, next) => {
  try {
    const user = req.user;
    if (user.role != "admin")
      next(new CustomError(`${user.role} cannot access this api endpoint`));
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = isAuthorized;
