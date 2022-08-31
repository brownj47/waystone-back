const { Schema, model } = require("mongoose");

const {Post, Group,atrributeSchema} = require("./Attributes")

// Schema to create User model
const userSchema = new Schema(
  {
		username: {
			type: String,
			unqiue: true,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			unqiue: true,
			required: true,
			// match: [
			// /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
			// "invalid email",
			// ],
		},
		password: {
			type: String,
			required: true,
			// match: [
			// 	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
			// 	"invalid password",
			// ],
		},
		bio: {
			type: String,
			default: ''
		},
		posts: [
			{
				type: Schema.Types.ObjectId,
				ref: "post",
			},
		],
		friends: [
			{
				type: Schema.Types.ObjectId,
				ref: "user",
			},
		],
		inbox: [
			{
				type: Schema.Types.ObjectId,
				ref: "user",
			},
		],
		outbox: [
			{
				type: Schema.Types.ObjectId,
				ref: "user",
			},
		],
		groups: [
			{
				type: Schema.Types.ObjectId,
				ref: "group",
			},
		],
		highlightedPosts: [
			{
				type: Schema.Types.ObjectId,
				ref: "post",
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
		},
  	}
);

//virtual for friend count, again something that can be used for
userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

const User = model("user", userSchema);

module.exports = User;
