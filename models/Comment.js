const { Schema } = require('mongoose');

//Comment schema
const commentSchema = new Schema(
    {
    commentId: {
        type: Schema.Types.ObjectId,
        unqiue: true,
        required: true,
    },
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
    commentBody: {
        type: String,
        required: true,
        max_length: 140
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type:Date,
        default:Date.now()
    },
	//This will be the first attempt at nesting comments, I don't think it'll work without some kind of parentId value in the model
    replies: [
        {
        type: Schema.Types.ObjectId,
        ref: 'comment',
        }
       ],
      
    },
  );

  const Comment = model('comment', commentSchema);

  module.exports = Comment;