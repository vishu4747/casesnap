const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const upload = require("../middleware/multer");
const isAuthenticated = require("../middleware/auth-middleware");
const isAuthorized = require("../middleware/authorized-middleware");

router.post("/create", userController.createUser);
router.post("/validateUser", userController.validateUser);
router.post("/verifyToken", userController.verifyToken);
router.post("/upload", isAuthenticated, upload, userController.upload);

//Admin routes
router.get(
  "/getAllUsers",
  isAuthenticated,
  isAuthorized,
  userController.getAllUsers
);

module.exports = router;
