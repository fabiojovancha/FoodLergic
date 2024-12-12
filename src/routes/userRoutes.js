const {
  getUserById,addUser,getUsers,updateUser
} = require("../controllers/userController");


module.exports = [
  {
      method: 'POST',
      path: '/addUser',
      handler: addUser, 
  },
  {
      method: 'GET',
      path: '/getUser/{userId}',
      handler: getUserById, 
  },
  {
      method: 'PUT',
      path: '/updateUser/{userId}',
      handler: updateUser, 
  },
];