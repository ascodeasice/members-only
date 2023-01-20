const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const MessageSchema = new Schema(
    {
        title: { type: String, required: true },
        text: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: "User", required: true }
    },
    {
        // adds timestamp to the Schema
        timestamps: true
    });

MessageSchema.virtual("createdAtFormatted").get(function () {
    return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATETIME_SHORT);
})

module.exports = mongoose.model("Message", MessageSchema);