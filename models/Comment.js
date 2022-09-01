const { Schema, model } = require('mongoose');

//Comment schema
const commentSchema = new Schema(
    {
    comment_body: {
        type:String,
        required: true,
        max_length: 140
    },
    username: {
        type:String,
        required: true
    },
    UserId: {
        type:String,
        required: true
    },
	PostId:{
        type:String,
        required: true
    },
	ParentId:{
        type:String,
        required: true
    },
	depth:{
		type:Number,
        default: 0
	},
    createdAt: {
        type:Date,
        default:Date.now()
    },
	votes:{
		type:Number,
		default:0
	},
    replies: [
        {
        	type: Schema.Types.ObjectId,
        	ref: 'comment',
        }
    ],  
	isDeactivated: {
		type: Boolean,
		default: false,
	},
    },
);

const Comment = model('comment', commentSchema);

module.exports = Comment;