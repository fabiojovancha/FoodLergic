const db = require("../services/simpanData");

  const addUser = async (req, res) => {
    try {
        const { username, email } = req.body;

        if (!username || !email) {
            return res.status(400).json({ message: "Username and email are required" });
        }

        const existingUserSnapshot = await db.collection("users").where("email", "==", email).get();
        if (!existingUserSnapshot.empty) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const newUser = {
            username,
            email,
            allergies: [],
            createdAt: new Date(),
        };

        const docRef = await db.collection("users").add(newUser);

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

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};
  
const getUserById = async (req, res) => {
    try {
        const { userId } = req.body

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const userDocRef = db.collection("users").doc(userId);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: "User not found" });
        }

        const userData = { id: userDoc.id, ...userDoc.data() };

        res.status(200).json(userData);
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { userId } = req.body; 
        const { username, email, allergies } = req.body; 

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const updatedData = {};
        if (username) updatedData.username = username;
        if (email) updatedData.email = email;
        if (allergies) updatedData.allergies = allergies;

        if (Object.keys(updatedData).length === 0) {
            return res.status(400).json({ message: "No valid fields to update" });
        }

        const userDocRef = db.collection("users").doc(userId);

        const userDoc = await userDocRef.get();
        if (!userDoc.exists) {
            return res.status(404).json({ message: "User not found" });
        }

        await userDocRef.update(updatedData);

        const updatedUser = { id: userDoc.id, ...updatedData };

        res.status(200).json({
            message: "User updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Failed to update user", error: error.message });
    }
};
  
module.exports = {
    addUser,
    getUsers,
    getUserById,
    updateUser,
};
 
  