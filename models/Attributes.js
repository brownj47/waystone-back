const { Schema } = require('mongoose');

//attribute schema
const attributeSchema = new Schema(
    {
		charisma: {
			type:String,
			required: true
		},
		wisdom: {
			type:String,
			required: true
		},
		intelligence: {
			type:String,
			required: true
		},

	}
)

module.exports = attributeSchema;