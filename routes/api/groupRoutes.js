const router = require('express').Router();
const {
  getAllGroups,
  getOneGroup,
  createNewGroup,
  updateGroup,
  deleteGroup,
  acceptRequest,
  denyRequest,
  deleteMember,
  deactivateGroup
} = require('../../controllers/groupController.js');

// /api/groups
router.route('/').get(getAllGroups).post(createNewGroup);

// /api/groups/group
router
  .route('/group')
  .get(getOneGroup)
  .put(updateGroup)
  .delete(deleteGroup);

// /api/groups/members
router.route('/members').put(acceptRequest).delete(denyRequest)

// /api/groups/members/remove
router.route('/members/remove').delete(deleteMember)

// /api/groups/deactivate
router.route('/deactivate').put(deactivateGroup);

module.exports = router;