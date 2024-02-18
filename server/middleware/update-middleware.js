const removeKeysMiddleware = (keysToRemove) => (req, res, next) => {
  keysToRemove.forEach((key) => {
    if (req.body.hasOwnProperty(key)) {
      delete req.body[key];
    }
  });
  next();
};

module.exports = removeKeysMiddleware;
