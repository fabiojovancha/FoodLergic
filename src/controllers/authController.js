const bcrypt = require("bcrypt");

// Penyimpanan sementara untuk pengguna (in-memory)
let users = [];

// Registrasi user baru
const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Periksa apakah email sudah terdaftar
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tambahkan pengguna ke penyimpanan sementara
    users.push({ username, email, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully" });
};

// Login user
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Cari user berdasarkan email
    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    // Periksa password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ message: "Login successful", user: { username: user.username, email: user.email } });
};

module.exports = { register, login };
