const { Schema, model } = require('mongoose');

//Comment schema
const commentSchema = new Schema(
    {
	//I believe this will be required for nesting comments, but I vote we try first with the replies matrix style array
    // parentId: {
    //     type: Schema.Types.ObjectId,
    //     unqiue: true,
    //     required: true,
    // },
    // depth: {
    //     type: Number,
    //     default: 1
    // },
    comment_body: {
        type:String,
        required: true,
        max_length: 140
    },
    UserId: {
        type:String,
        required: true
    },
	PostId:{
        type:String,
        required: true
    },
    createdAt: {
        type:Date,
        default:Date.now()
    },
	votes:{
		type:Number,
		default:0
	},
	//This will be the first attempt at nesting comments, I don't think it'll work without some kind of parentId value in the model
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