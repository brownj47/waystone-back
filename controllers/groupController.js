const { User, Post, Group, Comment } = require('../models');

module.exports = {
    getAllGroups(req, res) {
        Group.find()
            .populate('posts')
            .then((groups) => res.json(groups))
            .catch((err) => {
                console.log(err)
                res.status(500).json(err)
            });
    },
    getAllUsersGroups(req, res) {

        console.log(req.body.idList)
        Group.findbyPk()
            .populate('posts')
            .then((groups) => res.json(groups))
            .catch((err) => {
                console.log(err)
                res.status(500).json(err)
            });
    },

    getOneGroup(req, res) {
        Group.findOne({ _id: req.body.GroupId })
            .populate([
                {
                    path: 'posts',
                },
                {
                    path: 'members',
                },
            ])
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
                User.findOneAndUpdate(
                    { _id: groupData.admin },
                    { $addToSet: { groups: { _id: groupData.id } } },
                    { new: true }
                    );
                    res.json(groupData)
            })
            .catch((err) => res.status(500).json(err));
    },

    updateGroup(req, res) {
        Group.findOneAndUpdate(
            { _id: req.body.GroupId },
            { $set: req.body },
            { new: true }
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

    acceptRequest(req, res) {
        Group.findOneAndUpdate(
            { _id: req.body.GroupId },
            {
                $addToSet: { members: req.body.UserId },
                $pull: { inbox: req.body.UserId }
            },
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

    denyRequest(req, res) {
        Group.findOneAndUpdate(
            { _id: req.body.GroupId },
            { $pull: { inbox: req.body.UserId } }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: "No user with this id!" })
                    : res.json(user)
            )
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

    deactivateGroup(req, res) {
        Group.findOneAndUpdate(
            { _id: req.body.GroupId },
            { $set: { isDeactivated: req.body.isDeactivated } },
            { new: true },
        ).then((group) => {
            console.log(group)
            !group
                ? res.status(404).json({ message: 'No group with this id!' })
                : res.json(group)
        })
            .catch((err) => res.status(500).json(err));
    },
}