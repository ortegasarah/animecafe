const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'the name is required']
    },
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'the email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'the password is required']
    },
    image_url: {
        type: String,
        default: 'https://res.cloudinary.com/dnywgpjkn/image/upload/v1642564314/notFound_ryzezw.jpg'
    },
    google: {
        type: Boolean,
        default: false
    },
    idGoogle: {
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

const User = model("User", userSchema);

module.exports = User;