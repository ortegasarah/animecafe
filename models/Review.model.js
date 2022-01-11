const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    idMangapi: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
});

const Review = model("review", reviewSchema);

module.exports = Review;