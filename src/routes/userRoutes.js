const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  addAllergy,
  removeAllergy,
  findUserById,
} = require("../controllers/userController");

const router = express.Router();

// Melihat profil user
router.get("/:id", findUserById, getUserProfile);

// Memperbarui data profil
router.put("/:id", findUserById, updateUserProfile);

// Mengubah password
router.put("/:id/password", findUserById, updateUserPassword);

// Menambah alergi
router.post("/:id/allergies", findUserById, addAllergy);

// Menghapus alergi
router.delete("/:id/allergies", findUserById, removeAllergy);

module.exports = router;
