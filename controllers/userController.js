const { User, Post, Comment, Group } = require("../models");
const mongoose = require('../config/connection');

require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
	getAllUsers(req, res) {
		User.find()
		.sort({createdAt :'descending'})
		.populate("posts")
		.then((users) => res.json(users))
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
	},

  getOneUser(req, res) {
    User.findOne({ _id: req.params.UserId })
      .populate([
		{
			path:'posts',
		},
		{
			path:'friends',
		},
		{
			path:'groups',
		},
		])
		.select("-__v")
		.then((user) =>
			!user
			? res.status(404).json({ message: "No user with that ID" })
			: res.json(user)
		)
		.catch((err) => {
			console.log(err)
			res.status(500).json(err)});
	},

	randomUser(req, res) {
		User.countDocuments({isDeactivated:false})
		.then(count => {
			const random = Math.floor(Math.random()*count)
			console.log(random)
			User.findOne().skip(random)
			.populate('posts')
			.select('-__v')
			.then(async(user) =>{
				if (!user){
					res.status(404).json({ message: 'No user with that ID' })
				}
				res.json(user)
				const highlightedPosts = user.posts.sort(()=>{return .5 - Math.random()}).slice(0,3);
				// console.log(highlightedPosts)
				return await User.findOneAndUpdate(
					{ _id: user.id },
					{ $set: { highlightedPosts: highlightedPosts } },
					{ new: true }
				)
			})
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
		{ new: true }
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

	requestFriend(req, res) {
		User.findOneAndUpdate(
		{ _id: req.body.UserId },
		{ $addToSet: { outbox: req.body.RecipientId } }
		)
		.then((user) =>
			!user
			? res.status(404).json({ message: "No user with this id!" })
			: res.json(user)
		)
		.then(
			User.findOneAndUpdate(
			{ _id: req.body.RecipientId },
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
			$addToSet: { friends: req.body.SenderId },
			$pull: { inbox: req.body.SenderId }
		}
		)
		.then((user) =>
			!user
			? res.status(404).json({ message: "No user with this id!" })
			: res.json(user)
		)
		.then(
			User.findOneAndUpdate(
			{ _id: req.body.SenderId },
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
		{ $pull: { inbox: req.body.SenderId } }
		)
		.then((user) =>
			!user
			? res.status(404).json({ message: "No user with this id!" })
			: res.json(user)
		)
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

	requestGroup(req, res) {
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

	acceptInvite(req, res){
		User.findOneAndUpdate(
			{ _id: req.body.UserId },
			{ 
				$addToSet: { groups: req.body.GroupId },
				$pull: { groupInvites: req.body.GroupId }
			}
			)
			.then((user) =>
				!user
				? res.status(404).json({ message: "No user with this id!" })
				: res.json(user)
			)
			.then(
				Group.findOneAndUpdate(
				{ _id: req.body.GroupId },
				{ $addToSet: { members: req.body.UserId } },
				).catch((err) => {
				console.log(err);
				res.status(500).json(err);
				})
			);
	},

	denyInvite(req, res){
		User.findOneAndUpdate(
			{ _id: req.body.UserId },
			{ $pull: { groupInvites: req.body.GroupId } }
			)
			.then((user) =>
				!user
				? res.status(404).json({ message: "No user with this id!" })
				: res.json(user)
			)
	},

	async checkToken(req, res) {
		const token = req.headers.authorization.split(" ")[1];
		try {
		const userData = jwt.verify(token, process.env.JWT_SECRET);
		res.json(userData);
		} catch {
		res.status(403).json({ msg: "invalid token:"+ token });
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
		email: req.body.email
		}).then((foundUser) => {
			if (!foundUser) {
			return res.status(401).json({ msg: "invalid login creadentials!" });
			} else if (!bcrypt.compareSync(req.body.password, foundUser.password)) {
			return res.status(401).json({ msg: "invalid login creadentials!" });
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
