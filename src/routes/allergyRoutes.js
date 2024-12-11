const { updateUserAllergies, scanFood, addUserAllergies, deleteUserAllergy, showUserAllergy } = require("../controllers/allergyController");

const allergyRoutes = [
    {
        method: 'PUT',
        path: '/{userId}/allergies',
        handler: updateUserAllergies,
    },
    {
        method: 'POST',
        path: '/scan-food',
        handler: scanFood,
    },
    {
        method: 'POST',
        path: '/{userId}/allergies',
        handler: addUserAllergies,
    },
    {
        method: 'GET',
        path: '/show/{userId}/allergies',
        handler: showUserAllergy,
    },
    {
        method: 'DELETE',
        path: '/delete',
        handler: deleteUserAllergy,
    },
];

module.exports = allergyRoutes;
