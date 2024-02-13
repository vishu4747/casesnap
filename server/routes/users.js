const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");

router.get("/", (req, res) => {
  return res.status(200).json({ msg: "success" });
});

router.post("/create", userController.createUser);
router.post("/validateUser", userController.validateUser);
router.post("/verifyToken", userController.verifyToken);

module.exports = router;
