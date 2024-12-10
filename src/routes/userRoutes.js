const express = require("express");
const {
  getUserById,addUser,getUsers,updateUser
} = require("../controllers/userController");

const router = express.Router();
router.post("/addUser", addUser);

// Rute untuk mendapatkan daftar pengguna
router.get("/getUser/:userId", getUserById);
router.put("/updateUser/:userId", updateUser);

module.exports = router;
