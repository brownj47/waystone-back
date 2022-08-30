const router = require('express').Router();
const {
  getAllGroups,
  getOneGroup,
  createNewGroup,
  updateGroup,
  deleteGroup,
  addNewMembers,
  deleteMember,
} = require('../../controllers/groupController.js');

// /api/groups
router.route('/').get(getAllGroups).post(createNewGroup);

// /api/groups/posts
router
  .route('/group')
  .get(getOneGroup)
  .put(updateGroup)
  .delete(deleteGroup);

// /api/groups/members
router.route('/members').post(addNewMembers).delete(deleteMember)

module.exports = router;