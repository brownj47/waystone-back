const bcrypt = require('bcrypt')
const { Schema, model } = require("mongoose");

const { Post, Group, atrributeSchema } = require("./Attributes")

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
		groups: [
			{
				type: Schema.Types.ObjectId,
				ref: "group",
			},
		],
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

userSchema.pre('save', function (next) {
	//hash the password before adding to DB
	bcrypt.hash(this.password, 4).then((hash) => {
		this.password = hash
		console.log(this)

		next(); // next allows the request to continue, otherwise the function freezes here
	}).catch((err)=> console.log(err))
})
const User = model("user", userSchema);


module.exports = User;
