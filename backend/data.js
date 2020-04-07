const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// db data structure
const DataSchema = new Schema(
{
	id: Number,
	message: String
},
{ timestamps: true }
);

//export Schema for modification
module.exports = mongoose.model("Data", DataSchema)
