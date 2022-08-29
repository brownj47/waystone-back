const { Schema, model } = require("mongoose");

// Schema to create User model
const groupSchema = new Schema(
  {
    groupName: {
      type: String,
      unqiue: true,
      required: true,
      trim: true,
    },
    admin: {
      type: String,
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
    // tags: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "tags",
    //   },
    // ],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

//virtual for friend count, again something that can be used for
groupSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

const Group = model("group", groupSchema);

module.exports = Group;