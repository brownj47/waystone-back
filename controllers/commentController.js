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
        Comment.findOne({ _id: req.params.CommentId })
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
            return Post.findOneAndUpdate(
                {_id: commentData.PostId},
                {$addToSet: { comments: req.body }},
                {new: true}
            ) 
        }).catch((err) => {
            console.log(err)
            res.status(500).json(err)
        });
    },

    updateComment(req, res){
        Comment.findOneAndUpdate(
            { _id: req.params.CommentId },
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
        Comment.findOneAndDelete({ _id: req.params.CommentId })
        .then((comment) =>
        !comment
          ? res.status(404).json({ message: 'No comment with this id!' })
          : res.json({message: 'comment deleted'})
      )
      .catch((err) => res.status(500).json(err));
    },
}