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
    },
    type: {
        type: Number,
        enum: [0, 1, 2],
        default: 1,
        require: [true, 'the type is required']
    }
}, {
    timestamps: true,
});

const Folder = model("folder", folderSchema);

module.exports = Folder;