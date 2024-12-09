const express = require("express");
const {
  getUserById,getUsers,addUser,deleteUserById
} = require("../controllers/userController");

const router = express.Router();
router.post("/users", addUser);

// Rute untuk mendapatkan daftar pengguna
router.get("/users", getUsers);


module.exports = router;
