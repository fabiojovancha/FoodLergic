const express = require("express");
const router = express.Router();
const { updateUserAllergies, scanFood, addUserAllergy, deleteUserAllergy, showUserAllergy } = require("../controllers/allergyController");

// Rute untuk menambah pengguna


// Rute untuk memperbarui alergi pengguna
router.put("/:userId/allergies", updateUserAllergies);

// Rute untuk memindai makanan dan mencari alergi
router.post("/scan-food", scanFood);

// Rute untuk menambahkan alergi ke pengguna

router.post("/:userId/allergies", addUserAllergy);
router.get("/show/:userId/allergies", showUserAllergy)
router.delete("/delete", deleteUserAllergy);

module.exports = router;
