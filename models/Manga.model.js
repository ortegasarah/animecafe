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
    }
}, {
    timestamps: true,
});

const Manga = model("Manga", mangaSchema);

module.exports = Manga;