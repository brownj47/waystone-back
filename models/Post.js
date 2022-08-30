const { Schema, model } = require('mongoose');
const commentSchema = require('./Comment')

// Schema to create Thought model
const postSchema = new Schema(
	{
		postText: {
			type: String,
			required: true,
			min_length: 1,
			max_length: 280
		},
		username: {
				type:String,
				required: true,
		},
		createdAt: {
			type:Date,
			default:Date.now()
		},
		comments: [
			{
				type: Schema.Types.ObjectId,
				ref: "comment",
			  },
		],
	},
	{
		toJSON: {
			virtuals: true,
		}
	}
);

// Comment count could be something that we use to determine our karma feature
postSchema
	.virtual('commentCount')
	// Getter
	.get(function () {
		return this.comments.length;
	});

// Initialize our Post model
const Post = model('Post', postSchema);

module.exports = Post