const { Schema, model } = require("mongoose");

const mangaSchema = new Schema({
    idMangapi: {
        type: String,
        required: true
    },
    tittle: {
        type: String,
        required: [true, 'the tittle is required'],
    },
    img: {
        type: String,
        default: ''
    },
    active: {
        type: Boolean,
        default: true
    },
    comments: {
        type: Schema.Types.ObjectId,
        ref: "Review"
    }
}, {
    timestamps: true,
});

const Manga = model("manga", mangaSchema);

module.exports = Manga;