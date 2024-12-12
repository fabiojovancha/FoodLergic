const { updateUserAllergies, scanFood, addUserAllergies, deleteUserAllergy, showUserAllergy } = require("../controllers/allergyController");

const allergyRoutes = [
    {
        method: 'PUT',
        path: '/{userId}/allergies',
        handler: updateUserAllergies,  // Memperbarui alergi pengguna
    },
    {
        method: 'POST',
        path: '/scan-food',
        handler: scanFood,  // Memindai makanan untuk alergi
    },
    {
        method: 'POST',
        path: '/{userId}/allergies',
        handler: addUserAllergies,  // Menambahkan alergi baru
    },
    {
        method: 'GET',
        path: '/show/{userId}/allergies',
        handler: showUserAllergy,  // Menampilkan alergi pengguna
    },
    {
        method: 'POST',
        path: '/delete',
        handler: deleteUserAllergy,  // Menghapus alergi pengguna
    },
];

module.exports = allergyRoutes;