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

// /api/groups/:PostId
router
  .route('/:GroupId')
  .get(getOneGroup)
  .put(updateGroup)
  .delete(deleteGroup);

// /api/groups/:GroupId
router.route('/:GroupId/members/:UserdId').post(addNewMembers).delete(deleteMember)

module.exports = router;