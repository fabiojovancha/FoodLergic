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
    // Route to update user allergies
    {
        method: 'PUT',
        path: '/{userId}/allergies',
        handler: updateUserAllergies,
    },
    // Route to scan food and check for allergies
    {
        method: 'POST',
        path: '/scan-food',
        handler: scanFood, 
    },
    // Route to add an allergy to a user
    {
        method: 'POST',
        path: '/{userId}/allergies',
        handler: addUserAllergy, 
    },
    // Route to show user allergies
    {
        method: 'GET',
        path: '/show/{userId}/allergies',
        handler: showUserAllergy, // Function to handle showing user allergies
    },
    // Route to delete a user allergy
    {
        method: 'DELETE',
        path: '/delete',
        handler: deleteUserAllergy, // Function to handle deleting a user allergy
    },
];
