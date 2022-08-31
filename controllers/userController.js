const { User, Post, Comment, Group } = require("../models");

require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
	getAllUsers(req, res) {
		User.find()
		.populate("posts")
		.then((users) => res.json(users))
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
	},

	getOneUser(req, res) {
		User.findOne({ _id: req.body.UserId })
		.populate("posts")
		.select("-__v")
		.then((user) =>
			!user
			? res.status(404).json({ message: "No user with that ID" })
			: res.json(user)
		)
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

	createNewUser(req, res) {
		User.create(req.body)
		.then((userData) => {
			const token = jwt.sign(
			{
				id: userData.id,
				email: userData.username,
			},
			process.env.JWT_SECRET,
			{
				expiresIn: "2h",
			}
			);

			return res.json({
			token: token,
			user: userData,
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
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
			? res.status(404).json({ message: "No user with that ID" })
			: Post.deleteMany({ _id: { $in: user.posts } })
		)
		.then(() => res.json({ message: "User and posts deleted!" }))
		.catch((err) => res.status(500).json(err));
	},

	requestFriend(req, res){
		User.findOneAndUpdate(
			{ _id: req.body.UserId },
			{ $addToSet: { outbox: req.body.FriendId } }
		)
		.then((user) =>
			!user
			? res.status(404).json({ message: "No user with this id!" })
			: res.json(user)
		)
		.then(
			User.findOneAndUpdate(
			{ _id: req.body.FriendId },
			{ $addToSet: { inbox: req.body.UserId } },
			).catch((err) => {
			console.log(err);
			res.status(500).json(err);
			})
		);
	},

	acceptFriend(req, res) {
		User.findOneAndUpdate(
		{ _id: req.body.UserId },
		{ 
			$addToSet: { friends: req.body.FriendId },
			$pull: { inbox: req.body.FriendId }
		}
		)
		.then((user) =>
			!user
			? res.status(404).json({ message: "No user with this id!" })
			: res.json(user)
		)
		.then(
			User.findOneAndUpdate(
			{ _id: req.body.FriendId },
			{ $addToSet: { friends: req.body.UserId } }
			).catch((err) => {
			console.log(err);
			res.status(500).json(err);
			})
		);
	},

	denyFriend(req, res) {
		User.findOneAndUpdate(
		{ _id: req.body.UserId },
		{ $pull: { inbox: req.body.FriendId } }
		)
		.then((user) =>
			!user
			? res.status(404).json({ message: "No user with this id!" })
			: res.json(user)
		)
	},

	requestGroup(req, res){
		User.findOneAndUpdate(
			{ _id: req.body.UserId },
			{ $addToSet: { groupRequests: req.body.GroupId } }
		)
		.then((user) =>
			!user
			? res.status(404).json({ message: "No user with this id!" })
			: res.json(user)
		)
		.then(
			Group.findOneAndUpdate(
			{ _id: req.body.GroupId },
			{ $addToSet: { inbox: req.body.UserId } },
			).catch((err) => {
			console.log(err);
			res.status(500).json(err);
			})
		);
	},

	deleteFriend(req, res) {
		User.findOneAndUpdate(
		{ _id: req.body.UserId },
		{ $pull: { friends: req.body.FriendId } }
		)
		.then((user) =>
			!user
			? res.status(404).json({ message: "No user with this id!" })
			: res.json(user)
		)
		.then(
			User.findOneAndUpdate(
			{ _id: req.body.FriendId },
			{ $pull: { friends: req.body.UserId } }
			).catch((err) => {
			console.log(err);
			res.status(500).json(err);
			})
		);
	},

	async checkToken(req, res) {
		const token = req.headers.authorization.split(" ")[1];
		try {
		const userData = jwt.verify(token, process.env.JWT_SECRET);
		res.json(userData);
		} catch {
		res.status(403).json({ msg: "invalid token" });
		}
	},
	async userFromToken(req, res) {
		const token = req.headers.authorization.split(" ")[1];
		try {
		const userData = jwt.verify(token, process.env.JWT_SECRET);
		User.findByPk(userData.id, {
			include: [{ model: User }],
		})
			.then((userData) => {
			res.json(userData);
			})
			.catch((err) => {
			res.status(500).json({ msg: "an error occurred", err });
			});
		} catch {
		res.status(403).json({ msg: "invalid token" });
		}
	},
	async login(req, res) {
		User.findOne({
		where: { email: req.body.email },
		})
		.then((foundUser) => {
			if (!foundUser) {
			return res.status(401).json({ msg: "invalid login credentials!" });
			} else if (!bcrypt.compareSync(req.body.password, foundUser.password)) {
			return res.status(401).json({ msg: "invalid login credentials!" });
			} else {
			const token = jwt.sign(
				{
				id: foundUser.id,
				email: foundUser.email,
				},
				process.env.JWT_SECRET,
				{
				expiresIn: "2h",
				}
			);
			return res.json({
				token: token,
				user: foundUser,
			});
			}
		})
		.catch((err) => {
			res.status(500).json({ msg: "an error occurred", err });
		});
	},
	deactivateUser(req, res) {
		User.findOneAndUpdate(
		{ _id: req.body.UserId },
		{ $set: { isDeactivated: req.body.isDeactivated } },
		{ new: true }
		)
		.then((user) => {
			console.log(user);
			!user
			? res.status(404).json({ message: "No user with this id!" })
			: res.json(user);
		})
		.catch((err) => res.status(500).json(err));
	},
	};
