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
        User.findOne({ _id: req.params.userId })
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

    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
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
        User.findOneAndDelete({ _id: req.params.userId })
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
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
        ).then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with this id!' })
          : res.json(user)
        ).then(
        User.findOneAndUpdate(
            { _id: req.params.friendId },
            { $addToSet: { friends: req.params.userId } },
        )
        .catch((err) => {
        console.log(err)
        res.status(500).json(err)
    }));
    },
	
    deleteFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
        ).then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with this id!' })
          : res.json(user)
        ).then(
        User.findOneAndUpdate(
            { _id: req.params.friendId },
            { $pull: { friends: req.params.userId } },
        )
        .catch((err) => {
        console.log(err)
        res.status(500).json(err)
    }));
    },
}