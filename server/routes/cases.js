const express = require("express");
const router = express.Router();
const caseController = require("../controllers/cases");
const isAuthenticated = require("../middleware/auth-middleware");
const removeKeysMiddleware = require("../middleware/update-middleware");
const isAuthorized = require("../middleware/authorized-middleware");

router.get("/getMyCases", isAuthenticated, caseController.getMyCases);
router.get("/getCase/:id", isAuthenticated, caseController.getCase);
router.post(
  "/update/:id",
  isAuthenticated,
  removeKeysMiddleware(["id", "createdAt", "createdBy"]),
  caseController.updateCase
);
router.put(
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

router.post(
  "/createCase",
  isAuthenticated,
  isAuthorized,
  caseController.createCase
);

router.post(
  "/assignCase",
  isAuthenticated,
  isAuthorized,
  caseController.assignCase
);

module.exports = router;
