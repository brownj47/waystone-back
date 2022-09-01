const mongoose = require("../config/connection");
const { User, Post, Comment, Group } = require('../models');

userData = [
    {
        username: 'Joe',
		email: "joe@bob.com",
		password: 'abc123,'
    },
    {
        username: 'Bob',
		email: "bob@bob.com",
		password: 'abc123,'
    },
    {
        username: 'tucker',
		email: "tucker@bob.com",
		password: 'abc123,'
    },
    {
        username: 'Justus',
		email: "justus@bob.com",
		password: 'abc123,'
    },
    {
        username: 'Austin',
		email: "austin@bob.com",
		password: 'abc123,'
    },
    {
        username: 'Jonathan',
		email: "jonathan@bob.com",
		password: 'abc123,'
    },
]

mongoose.once('open', async () => {
    try {

        await Post.deleteMany({});
        await User.deleteMany({});
        await Comment.deleteMany({});
        await Group.deleteMany({});

        await User.insertMany(userData).then(data=>console.log(`Data inserted`)).catch(err=>console.log(err))
        process.exit(0)
    } catch (error) {
        console.log("Error: " + error)
    }
})