const express = require("express");
const { body, param } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const validateRequest = require("../middleware/validateRequest");
const { getTasks, createTask, updateTask, deleteTask } = require("../controllers/taskController");

const router = express.Router();

router.get("/", authMiddleware, getTasks);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("projectId").isMongoId().withMessage("Valid projectId is required"),
  ],
  validateRequest,
  createTask
);

router.put(
  "/:id",
  authMiddleware,
  [param("id").isMongoId().withMessage("Invalid task id")],
  validateRequest,
  updateTask
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  [param("id").isMongoId().withMessage("Invalid task id")],
  validateRequest,
  deleteTask
);

module.exports = router;
