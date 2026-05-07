const express = require("express");
const { createUser, getAllUsers, getUserById, updateUser, deleteUser, pickRandomUser } = require("../controllers/userController");

const router = express.Router();

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/pick-random", pickRandomUser);

module.exports = router;