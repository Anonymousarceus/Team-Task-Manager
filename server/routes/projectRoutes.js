const express = require("express");
const { body, param } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const validateRequest = require("../middleware/validateRequest");
const {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  updateProjectMembers,
} = require("../controllers/projectController");

const router = express.Router();

router.get("/", authMiddleware, getProjects);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  [body("title").trim().notEmpty().withMessage("Title is required")],
  validateRequest,
  createProject
);

router.get(
  "/:id",
  authMiddleware,
  [param("id").isMongoId().withMessage("Invalid project id")],
  validateRequest,
  getProjectById
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  [param("id").isMongoId().withMessage("Invalid project id")],
  validateRequest,
  updateProject
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  [param("id").isMongoId().withMessage("Invalid project id")],
  validateRequest,
  deleteProject
);

router.put(
  "/:id/members",
  authMiddleware,
  roleMiddleware("admin"),
  [param("id").isMongoId().withMessage("Invalid project id")],
  validateRequest,
  updateProjectMembers
);

module.exports = router;
