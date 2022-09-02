const router = require('express').Router();
const {
  getAllUsers,
  getOneUser,
  randomFriend,
  createNewUser,
  updateUser,
  deleteUser,
  requestFriend,
  acceptFriend,
  denyFriend,
  requestGroup,
  deleteFriend,
  deactivateUser,
} = require('../../controllers/userController.js');

// /api/users
router.route('/').get(getAllUsers).post(createNewUser);

// /api/d20
router.route('/d20').get(randomFriend);

// /api/users/user
router
  .route('/user/:UserId')
  .get(getOneUser) 
  .put(updateUser)
  .delete(deleteUser);

// /api/users/requests
router.route('/requests').post(requestFriend).put(acceptFriend).delete(denyFriend)

// /api/users/groups
router.route('/groups').post(requestGroup)

// /api/users/friends
router.route('/friends').delete(deleteFriend)

// /api/users/deactivate
router.route('/deactivate').put(deactivateUser)

module.exports = router;