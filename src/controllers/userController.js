// controllers/userController.js

// Database sementara
let users = [
    {
      id: 1,
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password123", // Untuk produksi, gunakan hashing
      allergies: ["peanuts", "shellfish"],
    },
  ];
  
  // Melihat profil user
  const getUserProfile = (req, res) => {
    // eslint-disable-next-line no-unused-vars
    const { password, ...profile } = req.user; // Sembunyikan password
    res.json(profile);
  };
  
  
  // Memperbarui data profil
  const updateUserProfile = (req, res) => {
    const { name, email, allergies } = req.body;
    if (name) req.user.name = name;
    if (email) req.user.email = email;
    if (allergies) req.user.allergies = allergies;
    res.json({ message: "Profile updated successfully", user: req.user });
  };
  
  // Mengubah password
  const updateUserPassword = (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (req.user.password !== oldPassword) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }
    req.user.password = newPassword;
    res.json({ message: "Password updated successfully" });
  };
  
  // Menambah alergi
  const addAllergy = (req, res) => {
    const { allergy } = req.body;
    if (!allergy) {
      return res.status(400).json({ error: "Allergy is required" });
    }
    if (req.user.allergies.includes(allergy)) {
      return res.status(400).json({ error: "Allergy already exists" });
    }
    req.user.allergies.push(allergy);
    res.json({ message: "Allergy added successfully", allergies: req.user.allergies });
  };
  
  // Menghapus alergi
  const removeAllergy = (req, res) => {
    const { allergy } = req.body;
    req.user.allergies = req.user.allergies.filter((a) => a !== allergy);
    res.json({ message: "Allergy removed successfully", allergies: req.user.allergies });
  };
  
  // Middleware untuk menemukan user berdasarkan ID
  const findUserById = (req, res, next) => {
    const userId = parseInt(req.params.id, 10);
    const user = users.find((u) => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    req.user = user;
    next();
  };
  
  module.exports = {
    getUserProfile,
    updateUserProfile,
    updateUserPassword,
    addAllergy,
    removeAllergy,
    findUserById,
  };
  