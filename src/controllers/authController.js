const bcrypt = require("bcrypt");
const db = require("../services/simpanData");

// Validasi email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Registrasi user baru
const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    try {
        // Periksa apakah email sudah terdaftar di Firestore
        const existingUserSnapshot = await db.collection("users").where("email", "==", email).get();
        if (!existingUserSnapshot.empty) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Simpan data user ke Firestore
        const newUser = {
            username,
            email,
            password: hashedPassword,
            createdAt: new Date(),
        };

        const docRef = await db.collection("users").add(newUser);
        console.log(`User registered with ID: ${docRef.id}`);

        res.status(201).json({ message: "User registered successfully", userId: docRef.id });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Login user
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Cari user berdasarkan email di Firestore
        const userSnapshot = await db.collection("users").where("email", "==", email).get();
        if (userSnapshot.empty) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const user = userSnapshot.docs[0].data();

        // Periksa password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        console.log(`User logged in: ${user.email}`);
        res.status(200).json({
            message: "Login successful",
            user: { id: userSnapshot.docs[0].id, username: user.username, email: user.email },
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Mendapatkan semua user
const getUsers = async (req, res) => {
    try {
        const usersSnapshot = await db.collection("users").get();

        if (usersSnapshot.empty) {
            return res.status(404).json({ message: "No users found" });
        }

        const users = usersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        console.log(`Fetched ${users.length} users`);
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};

module.exports = { register, login, getUsers };
