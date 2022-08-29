const { User, Post, Group, Comment } = require('../models');

module.exports = {
    getAllGroups(req, res) {
        Group.find()
        .populate('posts')
        .then((groups) => res.json(groups))
        .catch((err) => {
            console.log(err)
            res.status(500).json(err)});
    },

    getOneGroup(req, res) {
        Group.findOne({ _id: req.params.GroupId })
        .populate('posts')
        .select('-__v')
        .then((group) =>
        !group
          ? res.status(404).json({ message: 'No group with that ID' })
          : res.json(group)
      )
      .catch((err) => res.status(500).json(err));
    },

    createNewGroup(req, res) {
        Group.create(req.body)
        .then((groupData) => res.json(groupData))
        .catch((err) => res.status(500).json(err));
    },

    updateGroup(req, res) {
        Group.findOneAndUpdate(
            { _id: req.params.GroupId },
            { $set: req.body },
            {new: true}
        ).then((group) => {
        !group
          ? res.status(404).json({ message: 'No group with this id!' })
          : res.json(group)
        })
      .catch((err) => res.status(500).json(err));
    },

    deleteGroup(req, res) {
        Group.findOneAndDelete({ _id: req.params.GroupId })
      .then((group) =>
        !group
          ? res.status(404).json({ message: 'No group with that ID' })
          : Post.deleteMany({ _id: { $in: group.posts } })
      )
      .then(() => res.json({ message: 'group and posts deleted!' }))
      .catch((err) => res.status(500).json(err));
    },

    addNewMembers(req, res) {
        Group.findOneAndUpdate(
            { _id: req.params.GroupId },
            { $addToSet: { members: req.params.UserId } },
        ).then((group) =>
        !group
          ? res.status(404).json({ message: 'No group with this id!' })
          : res.json(group)
        ).then(
        User.findOneAndUpdate(
            { _id: req.params.UserId },
            { $addToSet: { groups: req.params.GroupId } },
        )
        .catch((err) => {
        console.log(err)
        res.status(500).json(err)
    }));
    },
	
    deleteMember(req, res) {
        Group.findOneAndUpdate(
            { _id: req.params.GroupId },
            { $pull: { members: req.params.UserId } },
        ).then((group) =>
        !group
          ? res.status(404).json({ message: 'No group with this id!' })
          : res.json(group)
        ).then(
        User.findOneAndUpdate(
            { _id: req.params.UserId },
            { $pull: { groups: req.params.GroupId } },
        )
        .catch((err) => {
        console.log(err)
        res.status(500).json(err)
    }));
    },
}