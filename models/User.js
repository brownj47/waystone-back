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
		bio: {
			type: String,
			default: ''
		},
		img_url: {
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
		groupRequests: [
			{
				type: Schema.Types.ObjectId,
				ref: "group",
			},
		],
		groupInvites: [
			{
				type: Schema.Types.ObjectId,
				ref: "group",
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

userSchema.pre("insertMany", async function (next, docs) {
    if (Array.isArray(docs) && docs.length) {
        const hashedUsers = docs.map(async (user) => {
            return await new Promise((resolve, reject) => {
                bcrypt.genSalt(4).then((salt) => {
                    let password = user.password.toString()
                    bcrypt.hash(password, salt).then(hash => {
                        user.password = hash
                        resolve(user)
                    }).catch(e => {
                        reject(e)
                    })
                }).catch((e) => {
                    reject(e)
                })
            })
        })
        docs = await Promise.all(hashedUsers)
        next()
    } else {
        return next(new Error("User list should not be empty")) // lookup early return pattern
    }
})
userSchema.pre('save', function (next) {
	//hash the password before adding to DB
	bcrypt.hash(this.password, 4).then((hash) => {
		this.password = hash
		console.log(this)

		next(); // next allows the request to continue, otherwise the function freezes here
	}).catch((err) => console.log(err))
})
const User = model("user", userSchema);


module.exports = User;
