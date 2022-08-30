const { User, Post, Comment, Group } = require('../models');

const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")

module.exports = {
  getAllUsers(req, res) {
    User.find()
      .populate('posts')
      .then((users) => res.json(users))
      .catch((err) => {
        console.log(err)
        res.status(500).json(err)
      });
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
      .then((userData) => {

        const token = jwt.sign(
          {
            id: userData.id,
            email: userData.username
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "2h"
          }
        )

        return res.json({
          token: token,
          user: userData
        })
      }
      ).catch((err) => res.status(500).json(err));
  },

  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
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

  async checkToken(req, res) {
    const token = req.headers.authorization.split(" ")[1]
    try {
      const userData = jwt.verify(token, process.env.JWT_SECRET)
      res.json(userData)
    } catch {
      res.status(403).json({ msg: "invalid token" })
    }
  },
  async userFromToken(req, res) {
    const token = req.headers.authorization.split(" ")[1]
    try {
      const userData = jwt.verify(token, process.env.JWT_SECRET)
      User.findByPk(userData.id, {
        include: [{ model: User }]
      }).then(userData => {
        res.json(userData)
      }).catch(err => {
        res.status(500).json({ msg: "an error occurred", err })
      })
    } catch {
      res.status(403).json({ msg: "invalid token" })
    }
  },
  async login(req, res) {
    User.findOne({
      where: { email: req.body.email }
    }).then(foundUser => {
      if (!foundUser) {
        return res.status(401).json({ msg: "invalid login credentials!" })
      }
      else if (!bcrypt.compareSync(req.body.password, foundUser.password)) {
        return res.status(401).json({ msg: "invalid login credentials!" })
      } else {
        const token = jwt.sign({
          id: foundUser.id,
          email: foundUser.email
        }, process.env.JWT_SECRET, {
          expiresIn: "2h"
        })
        return res.json({
          token: token,
          user: foundUser
        })
      }
    }).catch(err => {
      res.status(500).json({ msg: "an error occurred", err })
    })

  },
  getOneUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .populate('posts')
      .select('-__v')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      ).catch((err) => res.status(500).json(err));
  },

}