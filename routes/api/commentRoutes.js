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

// /api/comments/:CommentId
router
  .route('/:CommentId')
  .get(getOneComment)
  .put(updateComment)
  .delete(deleteComment);

module.exports = router;