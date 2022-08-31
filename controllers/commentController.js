const { User, Post, Comment, Group } = require('../models');

const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken")

module.exports = {
    getAllComments(req, res){
        Comment.find()
        .then((comments) => res.json(comments))
        .catch((err) => res.status(500).json(err));
    },

    getOneComment(req, res){
        Comment.findOne({ _id: req.body.CommentId })
        .select('-__v')
        .then((comment) =>
        !comment
          ? res.status(404).json({ message: 'No comment with that ID' })
          : res.json(comment)
      )
      .catch((err) => res.status(500).json(err));
    },

    createNewComment(req, res){
        Comment.create(req.body)
        .then((commentData) => {
            res.json(commentData)
			console.log(commentData)
            return Post.findOneAndUpdate(
                {_id: commentData.PostId},
                {$addToSet: { comments: {_id: commentData.id} }},
                {new: true}
            ) 
        }).catch((err) => {
            console.log(err)
            res.status(500).json(err)
        });
    },

    updateComment(req, res){
        Comment.findOneAndUpdate(
            { _id: req.body.CommentId },
            { $set: req.body },
            { new:true},
        ).then((comment) => {
            console.log(comment)
        !comment
          ? res.status(404).json({ message: 'No comment with this id!' })
          : res.json(comment)
          })
      .catch((err) => res.status(500).json(err));
    },
	
    deleteComment(req, res){
        Comment.findOneAndDelete({ _id: req.body.CommentId })
        .then((comment) =>
        !comment
          ? res.status(404).json({ message: 'No comment with this id!' })
          : res.json({message: 'comment deleted'})
      )
      .catch((err) => res.status(500).json(err));
    },

	deactivateComment(req, res){
        Comment.findOneAndUpdate(
            { _id: req.body.CommentId },
            { $set: {isDeactivated:req.body.isDeactivated} },
            { new:true},
        ).then((comment) => {
            console.log(comment)
        !comment
          ? res.status(404).json({ message: 'No comment with this id!' })
          : res.json(comment)
          })
      .catch((err) => res.status(500).json(err));
    },
}