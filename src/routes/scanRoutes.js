const express = require("express");
const router = express.Router();
const { addUser, getUsers, updateUserAllergies, scanFood, addUserAllergy } = require("../controllers/scanController");

// Rute untuk menambah pengguna
router.post("/users", addUser);

// Rute untuk mendapatkan daftar pengguna
router.get("/users", getUsers);

// Rute untuk memperbarui alergi pengguna
router.put("/users/:userId/allergies", updateUserAllergies);

// Rute untuk memindai makanan dan mencari alergi
router.post("/scan-food", scanFood);

// Rute untuk menambahkan alergi ke pengguna
router.post("/users/:userId/allergies", addUserAllergy);

module.exports = router;
