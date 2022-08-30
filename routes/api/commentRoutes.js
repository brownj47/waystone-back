const router = require('express').Router();
const {
  getAllComments,
  getOneComment,
  createNewComment,
  updateComment,
  deleteComment,
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
router.route('/deactivate').get(getAllComments).post(createNewComment);

module.exports = router;