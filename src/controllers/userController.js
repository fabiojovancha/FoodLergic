const { db } = require("../services/simpanData");

const addUser = async (request, h) => {
    try {
        const { username, email } = request.payload;

        if (!username || !email) {
            return h.response({ status: "fail", message: "Username and email are required" }).code(400);
        }

        const existingUserSnapshot = await db.collection("users").where("email", "==", email).get();
        if (!existingUserSnapshot.empty) {
            return h.response({ status: "fail", message: "Email already exists" }).code(400);
        }

        const newUser = {
            username,
            email,
            allergies: [],
            createdAt: new Date(),
        };

        const docRef = await db.collection("users").add(newUser);

        return h.response({
            status: "success",
            message: "User added successfully",
            id: docRef.id,
            data: newUser,
        }).code(201);
    } catch (error) {
        console.error("Error adding user:", error);
        return h.response({
            status: "fail",
            message: "Failed to add user",
            error: error.message,
        }).code(500);
    }
};

const getUsers = async (request, h) => {
    try {
        const usersSnapshot = await db.collection("users").get();

        if (usersSnapshot.empty) {
            return h.response({ status: "fail", message: "No users found" }).code(404);
        }

        const users = usersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return h.response({ status: "success", data: users }).code(200);
    } catch (error) {
        console.error("Error fetching users:", error);
        return h.response({
            status: "fail",
            message: "Error fetching users",
            error: error.message,
        }).code(500);
    }
};

const getUserById = async (request, h) => {
    try {
        const { userId } = request.params;

        if (!userId) {
            return h.response({ status: "fail", message: "User ID is required" }).code(400);
        }

        const userDocRef = db.collection("users").doc(userId);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            return h.response({ status: "fail", message: "User not found" }).code(404);
        }

        const userData = { id: userDoc.id, ...userDoc.data() };

        return h.response({ status: "success", data: userData }).code(200);
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return h.response({
            status: "fail",
            message: "Error fetching user",
            error: error.message,
        }).code(500);
    }
};

const updateUser = async (request, h) => {
    try {
        const { userId, username, email, allergies } = request.payload;

        if (!userId) {
            return h.response({ status: "fail", message: "User ID is required" }).code(400);
        }

        const updatedData = {};
        if (username) updatedData.username = username;
        if (email) updatedData.email = email;
        if (allergies) updatedData.allergies = allergies;

        if (Object.keys(updatedData).length === 0) {
            return h.response({ status: "fail", message: "No valid fields to update" }).code(400);
        }

        const userDocRef = db.collection("users").doc(userId);

        const userDoc = await userDocRef.get();
        if (!userDoc.exists) {
            return h.response({ status: "fail", message: "User not found" }).code(404);
        }

        await userDocRef.update(updatedData);

        const updatedUser = { id: userDoc.id, ...updatedData };

        return h.response({
            status: "success",
            message: "User updated successfully",
            data: updatedUser,
        }).code(200);
    } catch (error) {
        console.error("Error updating user:", error);
        return h.response({
            status: "fail",
            message: "Failed to update user",
            error: error.message,
        }).code(500);
    }
};
  
module.exports = {
    addUser,
    getUsers,
    getUserById,
    updateUser,
};
 
  