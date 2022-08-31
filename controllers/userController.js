const { User, Post, Group, Comment } = require('../models');

module.exports = {
    getAllUsers(req, res) {
        User.find()
        .populate('posts')
        .then((users) => res.json(users))
        .catch((err) => {
            console.log(err)
            res.status(500).json(err)});
    },

    getOneUser(req, res) {
        User.findOne({ _id: req.body.UserId })
        .populate('posts')
        .select('-__v')
        .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
    },

    createNewUser(req, res) {
        User.create(req.body)
        .then((userData) => res.json(userData))
        .catch((err) => res.status(500).json(err));
    },

    randomFriend(req, res) {
        User.findOne({ _id: req.body.UserId })
        .populate('posts')
        .select('-__v')
        .then(async(user) =>{
        	if (!user){
         		res.status(404).json({ message: 'No user with that ID' })
			}
        	res.json(user)
			const highlightedPosts = user.posts.sort(function(){return .5 - Math.random()}).slice(0,3);
			console.log(highlightedPosts)
			return await User.findOneAndUpdate(
				{ _id: user.id },
				{ $set: { highlightedPosts: highlightedPosts } },
				{ new: true }
			)
		})
      .catch((err) => res.status(500).json(err));
    },

    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.body.UserId },
            { $set: req.body },
            {new: true}
        ).then((user) => {
        !user
          ? res.status(404).json({ message: 'No user with this id!' })
          : res.json(user)
        })
      .catch((err) => res.status(500).json(err));
    },

    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.body.UserId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : Post.deleteMany({ _id: { $in: user.posts } })
      )
      .then(() => res.json({ message: 'User and posts deleted!' }))
      .catch((err) => res.status(500).json(err));
    },

    addNewFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.body.UserId },
            { $addToSet: { friends: req.body.FriendId } },
        ).then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with this id!' })
          : res.json(user)
        ).then(
        User.findOneAndUpdate(
            { _id: req.body.FriendId },
            { $addToSet: { friends: req.body.UserId } },
        )
        .catch((err) => {
        console.log(err)
        res.status(500).json(err)
    }));
    },
	
    deleteFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.body.UserId },
            { $pull: { friends: req.body.FriendId } },
        ).then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with this id!' })
          : res.json(user)
        ).then(
        User.findOneAndUpdate(
            { _id: req.body.FriendId },
            { $pull: { friends: req.body.UserId } },
        )
        .catch((err) => {
        console.log(err)
        res.status(500).json(err)
    }));
    },

	deactivateUser(req, res){
        User.findOneAndUpdate(
            { _id: req.body.UserId },
            { $set: {isDeactivated:req.body.isDeactivated} },
            { new:true},
        ).then((user) => {
            console.log(user)
        !user
          ? res.status(404).json({ message: 'No user with this id!' })
          : res.json(user)
          })
      .catch((err) => res.status(500).json(err));
    },
}

