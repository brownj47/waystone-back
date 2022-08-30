const router = require('express').Router();
const {
  getAllPosts,
  getOnePost,
  createNewPost,
  updatePost,
  deletePost,
} = require('../../controllers/postController.js');

// /api/posts
router.route('/').get(getAllPosts).post(createNewPost);

// /api/posts/:PostId
router
  .route('/post')
  .get(getOnePost)
  .put(updatePost)
  .delete(deletePost);

module.exports = router;