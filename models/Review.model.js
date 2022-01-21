const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
    reviewer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mal_id: {
        type: Number,
        required: true
    },
    content: {
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