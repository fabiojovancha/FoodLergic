// Import db dari simpanData.js
const db = require("../services/simpanData");

// Fungsi untuk menambah pengguna
const addUser = async (req, res) => {
    try {
        const { username, email } = req.body;

        if (!username || !email) {
            return res.status(400).json({ message: "Username and email are required" });
        }

        console.log("Adding user:", { username, email });

        // Periksa apakah email sudah ada di database
        const existingUserSnapshot = await db.collection("users").where("email", "==", email).get();
        if (!existingUserSnapshot.empty) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Buat objek pengguna baru
        const newUser = {
            username,
            email,
            allergies: [], // Daftar alergi awal kosong
            createdAt: new Date(),
        };

        // Simpan data pengguna baru
        const docRef = await db.collection("users").add(newUser);
        console.log("User added with ID:", docRef.id);

        res.status(201).json({
            message: "User added successfully",
            id: docRef.id,
            data: newUser,
        });
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ message: "Failed to add user", error: error.message });
    }
};

// Fungsi untuk mendapatkan semua pengguna
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

        console.log("Fetched users:", users);

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};

// Fungsi untuk memperbarui alergi pengguna
const updateUserAllergies = async (req, res) => {
    try {
        const { userId, allergies } = req.body;

        if (!userId || !Array.isArray(allergies)) {
            return res.status(400).json({ message: "Invalid data" });
        }

        await db.collection("users").doc(userId).update({ allergies });
        res.status(200).json({ message: "Allergies updated successfully" });
    } catch (error) {
        console.error("Error updating allergies:", error);
        res.status(500).json({ message: "Failed to update allergies", error: error.message });
    }
};

const addUserAllergies = async (req, res) => {
    try {
        const { userId, allergies } = req.body;

        if (!userId || !Array.isArray(allergies)) {
            return res.status(400).json({ message: "Invalid data" });
        }

        const userDoc = db.collection("users").doc(userId);
        const docSnapshot = await userDoc.get();

        if (!docSnapshot.exists) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update alergi pengguna
        await userDoc.update({
            allergies: db.FieldValue.arrayUnion(...allergies),
        });

        res.status(200).json({ message: "Allergies added successfully" });
    } catch (error) {
        console.error("Error adding allergies:", error);
        res.status(500).json({ message: "Failed to add allergies", error: error.message });
    }
};

// Fungsi untuk scan makanan
const scanFood = async (req, res) => {
    try {
        const { userId, foodName } = req.body;

        if (!userId || !foodName) {
            return res.status(400).json({ message: "User ID and food name are required" });
        }

        // Ambil data pengguna
        const userDoc = await db.collection("users").doc(userId).get();
        if (!userDoc.exists) {
            return res.status(404).json({ message: "User not found" });
        }

        const userAllergies = userDoc.data().allergies || [];

        // Cari makanan di database
        const foodSnapshot = await db.collection("foods").where("name", "==", foodName).get();
        if (foodSnapshot.empty) {
            return res.status(404).json({ message: "Food not found" });
        }

        const foodData = foodSnapshot.docs[0].data();

        // Cek apakah ada bahan yang cocok dengan alergi
        const matchingAllergies = foodData.ingredients.filter((ingredient) =>
            userAllergies.includes(ingredient)
        );

        if (matchingAllergies.length > 0) {
            return res.status(200).json({
                message: `This food contains allergens: ${matchingAllergies.join(", ")}`,
                containsAllergens: true,
            });
        }

        res.status(200).json({
            message: "This food is safe to eat",
            containsAllergens: false,
        });
    } catch (error) {
        console.error("Error scanning food:", error);
        res.status(500).json({ message: "Failed to scan food", error: error.message });
    }
};

// Ekspor fungsi untuk digunakan di server.js
module.exports = { addUser, getUsers, updateUserAllergies, scanFood, addUserAllergies };
