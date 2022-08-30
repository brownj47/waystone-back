const express = require('express');
const allRoutes = require('./routes');
const mongoose = require('./config/connection');
const cors = require("cors")

// Sets up the Express App
// =============================================================
const app = express();
app.use(cors())
const PORT = process.env.PORT || 3001;
// Requiring our models for syncing
const { User, Post, Group, Comment } = require('./models');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', allRoutes);

mongoose.once('open',() => {
    app.listen(PORT, () => {
		console.log(`API server running on port https//:localhost/${PORT}!`);
	  });
});