const { Schema, model } = require("mongoose");

const folderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    folderName: {
        type: String,
        required: [true, 'the folder name is required'],
    },
    contentFolder: {
        type: [{ type: Schema.Types.ObjectId, ref: "Manga" }],
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
});

const Folder = model("folder", folderSchema);

module.exports = Folder;