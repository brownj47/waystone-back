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

// /api/comments/comment
router
  .route('/comment')
  .get(getOneComment)
  .put(updateComment)
  .delete(deleteComment);

// /api/comments/reply
router.route('/reply').post(commentReply);

// /api/comments/deactivate
router.route('/deactivate').put(deactivateComment);

module.exports = router;