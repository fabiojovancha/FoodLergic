const { register, login } = require("../controllers/authController");


module.exports = [
    {
        method: "POST",
        path: "/register",
        handler: register,
    },
    {
        method: "POST",
        path: "/login",
        handler: login,
    },
];
