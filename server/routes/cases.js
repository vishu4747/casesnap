const express = require("express");
const router = express.Router();
const caseController = require("../controllers/cases");
const isAuthenticated = require("../middleware/auth-middleware");
const removeKeysMiddleware = require("../middleware/update-middleware");
const isAuthorized = require("../middleware/authorized-middleware");

router.post("/createCase", isAuthenticated, caseController.createCase);
router.get("/getMyCases", isAuthenticated, caseController.getMyCases);
router.post(
  "/update/:id",
  isAuthenticated,
  removeKeysMiddleware(["id", "createdAt", "createdBy"]),
  caseController.updateCase
);
router.get(
  "/updateStatus/:id",
  isAuthenticated,
  caseController.updateCaseStatus
);

//Admin routes
router.get(
  "/getAllCases",
  isAuthenticated,
  isAuthorized,
  caseController.getAllCases
);

module.exports = router;
