const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const scanRoutes = require("./routes/scanRoutes"); // Impor scanRoutes untuk rute pemindaian makanan

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Rute root
app.get("/", (req, res) => {
    res.send("Welcome to the API! Use /api/auth for authentication.");
});

// Gunakan rute dari authRoutes, userRoutes, dan scanRoutes
app.use("/api/auth", authRoutes);  // Rute autentikasi
app.use("/api/user", userRoutes);  // Rute pengguna
app.use("/api/scan", scanRoutes);   // Integrasi scanRoutes untuk pemindaian makanan

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
