const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const upload = require("../middleware/multer");
const isAuthenticated = require("../middleware/auth-middleware");

router.get("/", (req, res) => {
  return res.status(200).json({ msg: "success" });
});

router.post("/create", userController.createUser);
router.post("/validateUser", userController.validateUser);
router.post("/verifyToken", userController.verifyToken);
router.post("/upload", isAuthenticated, upload, userController.upload);

module.exports = router;
