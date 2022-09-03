const router = require('express').Router();
const {
  getAllComments,
  getOneComment,
  createNewComment,
  updateComment,
  commentReply,
  deleteComment,
  deactivateComment
} = require('../../controllers/commentController.js');

// /api/comments
router.route('/').get(getAllComments).post(createNewComment);

// /api/comments/comment/:CommentId
router
  .route('/comment/:CommentId')
  .get(getOneComment)
  .put(updateComment)
  .delete(deleteComment);

// /api/comments/reply
router.route('/reply').post(commentReply);

// /api/comments/deactivate
router.route('/deactivate').put(deactivateComment);

module.exports = router;