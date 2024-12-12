// Import db dari simpanData.js
const { db } = require("../services/simpanData");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

// Fungsi untuk memperbarui alergi pengguna
const updateUserAllergies = async (request, h) => {
    try {
        const { userId, allergies } = request.payload;

        if (!userId || !Array.isArray(allergies)) {
            return h.response({ message: "Invalid data" }).code(400);
        }

        await db.collection("users").doc(userId).update({
            allergies: db.FieldValue.arrayUnion(...allergies),
        });

        return h.response({ message: "Allergies updated successfully" }).code(200);
    } catch (error) {
        console.error("Error updating allergies:", error);
        return h.response({ message: "Failed to update allergies", error: error.message }).code(500);
    }
};

// Fungsi untuk menambahkan beberapa alergi sekaligus
const addUserAllergies = async (request, h) => {
    try {
        const { userId, allergies } = request.payload;

        if (!userId || !Array.isArray(allergies)) {
            return h.response({ message: "User ID and a list of allergies are required" }).code(400);
        }

        const userDocRef = db.collection("users").doc(userId);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            return h.response({ message: "User not found" }).code(404);
        }

        const userData = userDoc.data();
        const existingAllergies = userData.allergies || [];

        const newAllergies = allergies
            .filter((allergy) => !existingAllergies.some((a) => a.name === allergy))
            .map((allergy) => ({
                id: uuidv4(),
                name: allergy,
            }));

        if (newAllergies.length === 0) {
            return h.response({ message: "No new allergies to add" }).code(400);
        }

        const updatedAllergies = [...existingAllergies, ...newAllergies];

        await userDocRef.update({
            allergies: updatedAllergies,
        });

        return h.response({
            message: "Allergies added successfully",
            userId,
            allergies: updatedAllergies,
        }).code(200);
    } catch (error) {
        console.error("Error adding allergies:", error);
        return h.response({ message: "Failed to add allergies", error: error.message }).code(500);
    }
};

// Fungsi untuk menghapus alergi pengguna
const deleteUserAllergy = async (request, h) => {
    try {
        const { userId, allergyId } = request.payload;

        if (!userId || !allergyId) {
            return h.response({ message: "User ID and Allergy ID are required" }).code(400);
        }

        const userDocRef = db.collection("users").doc(userId);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            return h.response({ message: "User not found" }).code(404);
        }

        const userData = userDoc.data();
        const existingAllergies = userData.allergies || [];

        const updatedAllergies = existingAllergies.filter((allergy) => allergy.id !== allergyId);

        if (updatedAllergies.length === existingAllergies.length) {
            return h.response({ message: "Allergy not found" }).code(404);
        }

        await userDocRef.update({
            allergies: updatedAllergies,
        });

        return h.response({
            message: "Allergy removed successfully",
            userId,
            allergies: updatedAllergies,
        }).code(200);
    } catch (error) {
        console.error("Error deleting allergy:", error);
        return h.response({ message: "Failed to delete allergy", error: error.message }).code(500);
    }
};

// Fungsi untuk menampilkan alergi pengguna
const showUserAllergy = async (request, h) => {
    try {
        const { userId } = request.params;  // Ambil userId dari request.params, bukan request.payload

        if (!userId) {
            return h.response({ message: "User ID is required" }).code(400);
        }

        const userDocRef = db.collection("users").doc(userId);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            return h.response({ message: "User not found" }).code(404);
        }

        const userData = userDoc.data();
        const allergies = userData.allergies || [];

        return h.response({
            message: "Allergies retrieved successfully",
            userId,
            allergies,
        }).code(200);
    } catch (error) {
        console.error("Error fetching allergies:", error);
        return h.response({ message: "Failed to retrieve allergies", error: error.message }).code(500);
    }
};

// Fungsi untuk memindai makanan dan mencocokkan alergi
const scanFood = async (request, h) => {
    try {
        const { userId, foodName } = request.payload;

        if (!userId || !foodName) {
            return h.response({ message: "User ID and food name are required" }).code(400);
        }

        const userDoc = await db.collection("users").doc(userId).get();
        if (!userDoc.exists) {
            return h.response({ message: "User not found" }).code(404);
        }

        const userAllergies = userDoc.data().allergies || [];
        const foodSnapshot = await db.collection("foods").where("name", "==", foodName).get();

        if (foodSnapshot.empty) {
            return h.response({ message: "Food not found" }).code(404);
        }

        const foodData = foodSnapshot.docs[0].data();
        const matchingAllergies = foodData.ingredients.filter((ingredient) =>
            userAllergies.some((allergy) => allergy.name === ingredient)
        );

        if (matchingAllergies.length > 0) {
            return h.response({
                message: `This food contains allergens: ${matchingAllergies.join(", ")}`,
                containsAllergens: true,
            }).code(200);
        }

        return h.response({
            message: "This food is safe to eat",
            containsAllergens: false,
        }).code(200);
    } catch (error) {
        console.error("Error scanning food:", error);
        return h.response({ message: "Failed to scan food", error: error.message }).code(500);
    }
};

module.exports = {
    updateUserAllergies,
    addUserAllergies,
    deleteUserAllergy,
    showUserAllergy,
    scanFood,
};
