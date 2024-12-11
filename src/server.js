const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const allergyRoutes= require("./routes/allergyRoutes");
const predictRoutes = require("./routes/predictRoutes");
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

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes); 
app.use("/api/allergy", allergyRoutes); 
app.use("/api/predict", predictRoutes)

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

