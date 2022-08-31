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
        Group.findOne({ _id: req.body.GroupId })
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
		.then(async (groupData) => {
			res.json(groupData)
			const adminData = await User.findOneAndUpdate(
				{ _id: groupData.admin },
				{ $addToSet: { groups: { _id: groupData.id } } },
				{ new: true }
				);
			return await Group.findOneAndUpdate(
				{ _id: adminData.groups[adminData.groups.length - 1] },
				{ $addToSet: { members: { _id: adminData._id } } },
				{ new: true }
				);
			})
        .catch((err) => res.status(500).json(err));
    },

    updateGroup(req, res) {
        Group.findOneAndUpdate(
            { _id: req.body.GroupId },
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
        Group.findOneAndDelete({ _id: req.body.GroupId })
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
            { _id: req.body.GroupId },
            { $addToSet: { members: req.body.UserId } },
        ).then((group) =>
        !group
          ? res.status(404).json({ message: 'No group with this id!' })
          : res.json(group)
        ).then(
        User.findOneAndUpdate(
            { _id: req.body.UserId },
            { $addToSet: { groups: req.body.GroupId } },
        )
        .catch((err) => {
        console.log(err)
        res.status(500).json(err)
    }));
    },
	
    deleteMember(req, res) {
        Group.findOneAndUpdate(
            { _id: req.body.GroupId },
            { $pull: { members: req.body.UserId } },
        ).then((group) =>
        !group
          ? res.status(404).json({ message: 'No group with this id!' })
          : res.json(group)
        ).then(
        User.findOneAndUpdate(
            { _id: req.body.UserId },
            { $pull: { groups: req.body.GroupId } },
        )
        .catch((err) => {
        console.log(err)
        res.status(500).json(err)
    }));
    },

	deactivateGroup(req, res){
        Group.findOneAndUpdate(
            { _id: req.body.GroupId },
            { $set: {isDeactivated:req.body.isDeactivated} },
            { new:true},
        ).then((group) => {
            console.log(group)
        !group
          ? res.status(404).json({ message: 'No group with this id!' })
          : res.json(group)
          })
      .catch((err) => res.status(500).json(err));
    },
}