const express = require("express");
const { createUser, getAllUsers, getUserById, updateUser, deleteUser, pickRandomUser, getUserWithHistory } = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Admin only routes
router.post("/", protect, authorize('admin'), createUser);
router.put("/:id", protect, authorize('admin'), updateUser);
router.delete("/:id", protect, authorize('admin'), deleteUser);

// Protected routes (any authenticated user)
router.get("/", protect, getAllUsers);
router.get("/:id", protect, getUserById);
router.get("/:id/history", protect, authorize('admin'), getUserWithHistory);
router.post("/pick-random", protect, authorize('admin'), pickRandomUser);

module.exports = router;