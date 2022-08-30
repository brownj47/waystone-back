const router = require('express').Router();
const {
  getAllComments,
  getOneComment,
  createNewComment,
  updateComment,
  deleteComment,
  deactivateComment
} = require('../../controllers/commentController.js');

// /api/comments
router.route('/').get(getAllComments).post(createNewComment);

// /api/comments/comment
router
  .route('/comment')
  .get(getOneComment)
  .put(updateComment)
  .delete(deleteComment);

// /api/comments/deactivate
router.route('/deactivate').put(deactivateComment);

module.exports = router;