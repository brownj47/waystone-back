const { User, Post, Group, Comment } = require('../models');

module.exports = {
    getAllPosts(req, res){
        Post.find()
        .then((posts) => res.json(posts))
        .catch((err) => res.status(500).json(err));
    },

    getOnePost(req, res){
        Post.findOne({ _id: req.body.PostId })
         .select('-__v')
        .then((post) =>
        !Post
          ? res.status(404).json({ message: 'No Post with that ID' })
          : res.json(post)
      )
      .catch((err) => res.status(500).json(err));
    },

    createNewPost(req, res){
        Post.create(req.body)
        .then((postData) => {
            res.json(postData)
            return User.findOneAndUpdate(
                {_id: postData.UserId},
                {$addToSet: { posts: { _id: postData.id } }},
                {new: true}
            ) 
        }).catch((err) => {
            console.log(err)
            res.status(500).json(err)
        });
    },

    updatePost(req, res){
        Post.findOneAndUpdate(
            { _id: req.body.PostId },
            { $set: req.body },
            { new:true},
        ).then((post) => {
            console.log(post)
        !Post
          ? res.status(404).json({ message: 'No Post with this id!' })
          : res.json(post)
          })
      .catch((err) => res.status(500).json(err));
    },
	
    deletePost(req, res){
        Post.findOneAndDelete({ _id: req.body.PostId })
        .then((post) =>
        !Post
          ? res.status(404).json({ message: 'No Post with this id!' })
          : res.json({message: 'Post deleted'})
      )
      .catch((err) => res.status(500).json(err));
    },

	deactivatePost(req, res){
        Post.findOneAndUpdate(
            { _id: req.body.PostId },
            { $set: {isDeactivated:req.body.isDeactivated} },
            { new:true},
        ).then((post) => {
            console.log(post)
        !post
          ? res.status(404).json({ message: 'No post with this id!' })
          : res.json(post)
          })
      .catch((err) => res.status(500).json(err));
    },
}