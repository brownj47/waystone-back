const { Schema, model } = require("mongoose");

// Schema to create User model
const groupSchema = new Schema(
	{
		group_name: {
			type: String,
			unqiue: true,
			required: true,
			trim: true,
		},
		admin: {
			type: Schema.Types.ObjectId,
			ref: "user",
		},
		posts: [
			{
				type: Schema.Types.ObjectId,
				ref: "post",
			},
		],
		members: [
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
		// tags: [
		//   {
		//     type: Schema.Types.ObjectId,
		//     ref: "tags",
		//   },
		// ],
		isDeactivated: {
			type: Boolean,
			default: false,
		},
	},
	{
		toJSON: {
			virtuals: true,
		},
		timestamps:true
	}
);

//virtual for friend count, again something that can be used for
groupSchema.virtual("memberCount").get(function () {
	return this.members.length;
});

const Group = model("group", groupSchema);

module.exports = Group;