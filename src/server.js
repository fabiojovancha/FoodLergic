const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");

// Konfigurasi environment variables
dotenv.config();

// Inisialisasi aplikasi
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rute root
app.get("/", (req, res) => {
    res.send("Welcome to the API! Use /api/auth for authentication.");
});

// Routes
app.use("/api/auth", authRoutes);

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
