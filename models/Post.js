const { Schema, model } = require('mongoose');
const commentSchema = require('./Comment')

// Schema to create Thought model
const postSchema = new Schema(
	{	
		title: {
			type: String,
			required: true,
			min_length: 1,
			max_length: 80
		},
		post_body: {
			type: String,
			required: true,
			min_length: 1,
			max_length: 280
		},
		username: {
				type:String,
				required: true,
		},
		UserId: {
				type:String,
				required: true,
		},
		GroupId: {
			type:String,
			default:''
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
		isDeactivated: {
			type: Boolean,
			default: false,
		},
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
const Post = model('post', postSchema);

module.exports = Post