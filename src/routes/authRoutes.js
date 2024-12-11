const express = require("express");
const { register, login } = require("../controllers/authController");

const router = express.Router();

// router.post("/register", register);
// router.post("/login", login);

module.exports = [
    {
        method: 'POST',
        path:  '/register',
        handler: register
    },
    {
        method: 'POST',
        path:  '/login',
        handler: login
    }
];
