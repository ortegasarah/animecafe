const router = require("express").Router();
const axios = require("axios");
const User = require("../models/User.model");
const { uploadFile } = require("../helpers/upload-file");

router.get("/user-profile", async(req, res, next) => {
    try {
        if (req.session.currentUser) {
            const { _id: idUser } = req.session.currentUser
            const folders = await axios.get(`${process.env.ANIME_URI}/folder/getFolders/${idUser}`);
            const contentFolder = folders.data.item;

            res.render('users/user-profile', { userInSession: req.session.currentUser, folders: contentFolder });
        } else {
            res.render('');
        }
    } catch (e) {
        console.log(e)
    }


});

router.get("/profile/:id", async(req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) res.render("error");
        const user = await User.findById(id);
        console.log(user);
        res.render('users/profile', { user_s: user, uri: process.env.ANIME_URI });
    } catch (e) {
        console.log(e);
    }

});


router.post('/', async(req, res, next) => {
    try {
        const { email, username, name, id } = req.body;

        const userEmail = await User.findOne({ email });
        const userName = await User.findOne({ username });
        if (userEmail && userEmail._id != id) {
            res.render('users/profile', { errorMessage: 'Email is already registered', uri: process.env.ANIME_URI });
        } else if (userName && userName._id != id) {
            res.render('users/profile', { errorMessage: 'username is already registered', uri: process.env.ANIME_URI });
        }
        const user = await User.findById(id);
        if (req.files) {
            const secure_url = await uploadFile(user, req.files.archivo);
            user.img = secure_url;
        }
        user.email = email;
        user.username = username;
        user.name = name;
        await user.save();
        req.session.currentUser = user;
        res.render('users/profile', { user_s: user, uri: process.env.ANIME_URI });


    } catch (e) {
        console.log(e);
        res.render('users/profile', { errorMessage: 'Error', uri: process.env.ANIME_URI });
    }
});


router.post("/delete/:id", async(req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) res.render("error");
        const user = await User.findByIdAndUpdate(id, { active: false }, { new: true });
        return res.render('');

    } catch (e) {
        console.log(e);
        res.render("error");
    }
});


module.exports = router;