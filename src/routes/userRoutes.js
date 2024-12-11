const express = require("express");
const {
  getUserById,addUser,getUsers,updateUser
} = require("../controllers/userController");

// const router = express.Router();
// router.post("/addUser", addUser);

// // Rute untuk mendapatkan daftar pengguna
// router.get("/getUser/:userId", getUserById);
// router.put("/updateUser/:userId", updateUser);

module.exports = [
  // Route to add a user
  {
      method: 'POST',
      path: '/addUser',
      handler: addUser, // Function to handle adding a user
  },
  // Route to get a user by ID
  {
      method: 'GET',
      path: '/getUser/{userId}',
      handler: getUserById, // Function to handle fetching a user by ID
  },
  // Route to update a user by ID
  {
      method: 'PUT',
      path: '/updateUser/{userId}',
      handler: updateUser, // Function to handle updating a user by ID
  },
];