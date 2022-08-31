const router = require('express').Router();
const {
  getAllPosts,
  getOnePost,
  createNewPost,
  updatePost,
  deletePost,
  deactivatePost
} = require('../../controllers/postController.js');

// /api/posts
router.route('/').get(getAllPosts).post(createNewPost);

// /api/posts/:PostId
router
  .route('/post')
  .get(getOnePost)
  .put(updatePost)
  .delete(deletePost);

// /api/posts/deactivate
router.route('/deactivate').put(deactivatePost);

module.exports = router;