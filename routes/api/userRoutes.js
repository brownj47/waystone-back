const router = require('express').Router();
const {
  getAllUsers,
  getOneUser,
  createNewUser,
  randomFriend,
  updateUser,
  deleteUser,
  addNewFriend,
  deleteFriend,
  deactivateUser,

} = require('../../controllers/userController.js');

// /api/users
router.route('/').get(getAllUsers).post(createNewUser);

// /api/d20
router.route('/d20').get(randomFriend);

// /api/users/user
router
  .route('/user')
  .get(getOneUser)
  .put(updateUser)
  .delete(deleteUser);

// /api/users/friends
router.route('/friends').post(addNewFriend).delete(deleteFriend)

// /api/users/deactivate
router.route('/deactivate').put(deactivateUser)

module.exports = router;