const router = require('express').Router();
const {
  getAllUsers,
  getOneUser,
  createNewUser,
  updateUser,
  deleteUser,
  addNewFriend,
  deleteFriend,
} = require('../../controllers/userController.js');

// /api/users
router.route('/').get(getAllUsers).post(createNewUser);

// /api/users/user
router
  .route('/user')
  .get(getOneUser)
  .put(updateUser)
  .delete(deleteUser);

// /api/users/friends
router.route('/friends').post(addNewFriend).delete(deleteFriend)

module.exports = router;