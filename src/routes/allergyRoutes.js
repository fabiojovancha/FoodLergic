const express = require("express");
const router = express.Router();
const { updateUserAllergies, scanFood, addUserAllergy, deleteUserAllergy, showUserAllergy } = require("../controllers/allergyController");

// Rute untuk menambah pengguna


// router.put("/:userId/allergies", updateUserAllergies);

// // Rute untuk memindai makanan dan mencari alergi
// router.post("/scan-food", scanFood);

// // Rute untuk menambahkan alergi ke pengguna

// router.post("/:userId/allergies", addUserAllergy);
// router.get("/show/:userId/allergies", showUserAllergy)
// router.delete("/delete", deleteUserAllergy);

module.exports = [
    {
        method: 'PUT',
        path: '/{userId}/allergies',
        handler: updateUserAllergies,
    },

    {
        method: 'POST',
        path: '/scan-food',
        handler: scanFood, 
    },

    {
        method: 'POST',
        path: '/{userId}/allergies',
        handler: addUserAllergy, 
    },
    {
        method: 'GET',
        path: '/show/{userId}/allergies',
        handler: showUserAllergy, 
    },
    {
        method: 'DELETE',
        path: '/delete',
        handler: deleteUserAllergy, 
    },
];
