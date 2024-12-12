const bcrypt = require("bcrypt");
const { db } = require("../services/simpanData");

// Validasi email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Registrasi user baru
const register = async (request, h) => {
    const { username, email, password } = request.payload;

    if (!username || !email || !password) {
        return h.response({ status: "fail", message: "All fields are required" }).code(400);
    }

    if (!isValidEmail(email)) {
        return h.response({ status: "fail", message: "Invalid email format" }).code(400);
    }

    if (password.length < 8) {
        return h.response({ status: "fail", message: "Password must be at least 8 characters long" }).code(400);
    }

    try {
        const existingUserSnapshot = await db.collection("users").where("email", "==", email).get();
        if (!existingUserSnapshot.empty) {
            return h.response({ status: "fail", message: "Email already exists" }).code(400);
        }

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

        return h.response({
            status: "success",
            message: "User registered successfully",
            userId: docRef.id,
        }).code(201);
    } catch (error) {
        console.error("Error registering user:", error);
        return h.response({
            status: "fail",
            message: "Internal server error",
            error: error.message,
        }).code(500);
    }
};

// Login user
const login = async (request, h) => {
    const { email, password } = request.payload;

    if (!email || !password) {
        return h.response({ status: "fail", message: "All fields are required" }).code(400);
    }

    try {
        const userSnapshot = await db.collection("users").where("email", "==", email).get();
        if (userSnapshot.empty) {
            return h.response({ status: "fail", message: "Invalid email or password" }).code(400);
        }

        const user = userSnapshot.docs[0].data();

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return h.response({ status: "fail", message: "Invalid email or password" }).code(400);
        }

        console.log(`User logged in: ${user.email}`);
        return h.response({
            status: "success",
            message: "Login successful",
            user: { id: userSnapshot.docs[0].id, username: user.username, email: user.email },
        }).code(200);
    } catch (error) {
        console.error("Error logging in user:", error);
        return h.response({
            status: "fail",
            message: "Internal server error",
            error: error.message,
        }).code(500);
    }
};

// Mendapatkan semua user
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

        console.log(`Fetched ${users.length} users`);
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

module.exports = {
    register,
    login,
    getUsers,
};


module.exports = { register, login, getUsers };
