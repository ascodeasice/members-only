const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
    {
        title: { type: String, required: true },
        text: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: "User", required: true }
    }
    ,
    {
        // adds timestamp to the Schema
        timestamps: true
    });

module.exports = mongoose.model("Message", MessageSchema);