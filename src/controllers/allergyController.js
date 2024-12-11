// Import db dari simpanData.js
const db = require("../services/simpanData");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

// Fungsi untuk memperbarui alergi pengguna
const updateUserAllergies = async (req, res) => {
    try {
        const { userId, allergies } = req.body;

        if (!userId || !Array.isArray(allergies)) {
            return res.status(400).json({ message: "Invalid data" });
        }

        await db.collection("users").doc(userId).update({
            allergies: db.FieldValue.arrayUnion(...allergies),
        });

        res.status(200).json({ message: "Allergies updated successfully" });
    } catch (error) {
        console.error("Error updating allergies:", error);
        res.status(500).json({ message: "Failed to update allergies", error: error.message });
    }
};

// const addUserAllergy = async (req, res) => {
//     try {
//         const { userId, allergy } = req.body;
        
//         if (!userId || !allergy) {
//             return res.status(400).json({ message: "User ID and allergy are required" });
//         }

//         const userDoc = await db.collection("users").doc(userId).get();

//         if (!userDoc.exists) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const userData = userDoc.data();
//         const existingAllergies = userData.allergies || [];

//         if (existingAllergies.includes(allergy)) {
//             return res.status(400).json({ message: "Allergy already added" });
//         }

//         existingAllergies.push(allergy);

//         await db.collection("users").doc(userId).update({
//             allergies: existingAllergies,
//         });

//         res.status(200).json({
//             message: "Allergy added successfully",
//             userId: userId,
//             allergies: existingAllergies,
//         });
//     } catch (error) {
//         console.error("Error adding allergy:", error);
//         res.status(500).json({ message: "Failed to add allergy", error: error.message });
//     }
// };

// Fungsi untuk menambahkan beberapa alergi sekaligus
const addUserAllergies = async (req, res) => {
    try {
        const { userId, allergies } = req.body;

        // Validasi input
        if (!userId || !Array.isArray(allergies)) {
            return res.status(400).json({ message: "User ID and a list of allergies are required" });
        }

        if (allergies.length > 5) {
            return res.status(400).json({ message: "You can only add up to 5 allergies at a time" });
        }

        // Referensi dokumen pengguna
        const userDocRef = db.collection("users").doc(userId);
        const userDoc = await userDocRef.get();

        // Periksa apakah dokumen pengguna ada
        if (!userDoc.exists) {
            return res.status(404).json({ message: "User not found" });
        }

        const userData = userDoc.data();
        const existingAllergies = userData.allergies || [];

        // Filter alergi baru yang belum ada
        const newAllergies = allergies
            .filter((allergy) => !existingAllergies.some((a) => a.name === allergy))
            .map((allergy) => ({
                id: uuidv4(), // ID unik
                name: allergy,
            }));

        if (newAllergies.length === 0) {
            return res.status(400).json({ message: "No new allergies to add" });
        }

        // Tambahkan alergi baru ke array
        const updatedAllergies = [...existingAllergies, ...newAllergies];

        // Update data pengguna dengan alergi baru
        await userDocRef.update({
            allergies: updatedAllergies,
        });

        res.status(200).json({
            message: "Allergies added successfully",
            userId: userId,
            allergies: updatedAllergies,
        });
    } catch (error) {
        console.error("Error adding allergies:", error);
        res.status(500).json({ message: "Failed to add allergies", error: error.message });
    }
};

const deleteUserAllergy = async (req, res) => {
    try {
        const { userId, allergyId } = req.body;

        // Validasi input
        if (!userId || !allergyId) {
            return res.status(400).json({ message: "User ID and Allergy ID are required" });
        }

        // Referensi dokumen pengguna
        const userDocRef = db.collection("users").doc(userId);
        const userDoc = await userDocRef.get();

        // Periksa apakah dokumen pengguna ada
        if (!userDoc.exists) {
            return res.status(404).json({ message: "User not found" });
        }

        const userData = userDoc.data();
        const existingAllergies = userData.allergies || [];

        // Periksa apakah alergi dengan ID yang diberikan ada
        const updatedAllergies = existingAllergies.filter((allergy) => allergy.id !== allergyId);

        if (updatedAllergies.length === existingAllergies.length) {
            return res.status(404).json({ message: "Allergy not found" });
        }

        // Update dokumen pengguna dengan array alergi yang diperbarui
        await userDocRef.update({
            allergies: updatedAllergies,
        });

        res.status(200).json({
            message: "Allergy removed successfully",
            userId: userId,
            allergies: updatedAllergies,
        });
    } catch (error) {
        console.error("Error deleting allergy:", error);
        res.status(500).json({ message: "Failed to delete allergy", error: error.message });
    }
};

const showUserAllergy = async (req,res) =>{
    try {
        const { userId } = req.params;

        // Validasi input
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Referensi dokumen pengguna
        const userDocRef = db.collection("users").doc(userId);
        const userDoc = await userDocRef.get();

        // Periksa apakah dokumen pengguna ada
        if (!userDoc.exists) {
            return res.status(404).json({ message: "User not found" });
        }

        // Ambil data alergi pengguna
        const userData = userDoc.data();
        const allergies = userData.allergies || [];

        // Kirim respons
        res.status(200).json({
            message: "Allergies retrieved successfully",
            userId: userId,
            allergies: allergies,
        });
    } catch (error) {
        console.error("Error fetching allergies:", error);
        res.status(500).json({ message: "Failed to retrieve allergies", error: error.message });
    }
};



// Fungsi untuk scan makanan
const scanFood = async (req, res) => {
    try {
        const { userId, foodName } = req.body;

        if (!userId || !foodName) {
            return res.status(400).json({ message: "User ID and food name are required" });
        }

        const userDoc = await db.collection("users").doc(userId).get();
        if (!userDoc.exists) {
            return res.status(404).json({ message: "User not found" });
        }

        const userAllergies = userDoc.data().allergies || [];
        const foodSnapshot = await db.collection("foods").where("name", "==", foodName).get();

        if (foodSnapshot.empty) {
            return res.status(404).json({ message: "Food not found" });
        }

        const foodData = foodSnapshot.docs[0].data();
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

// Ekspor fungsi untuk digunakan di routes
module.exports = { updateUserAllergies, scanFood, addUserAllergies, deleteUserAllergy, showUserAllergy};