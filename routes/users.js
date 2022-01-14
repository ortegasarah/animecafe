const router = require("express").Router();
const axios = require("axios");
const User = require("../models/User.model");
const { validatePasswords } = require("../middlewares/validate");
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);


router.get("/user-profile", async(req, res, next) => {
    if (req.session.currentUser) {
        console.log(req.session.currentUser)
        const { _id: idUser } = req.session.currentUser
        const folders = await axios.get(`http://localhost:3000/folder/getFolders/${idUser}`);
        console.log(folders.data)
        res.render('users/user-profile', { userInSession: req.session.currentUser, folders: folders.data });
    } else {
        res.render('');
    }

});

router.get("/profile/:id", async(req, res, next) => {
    const { id } = req.params;
    if (id) {
        const user = await User.findById(id);
        console.log(user);
        res.render('users/profile', user);
    } else {
        res.render('');
    }
});

router.put('/upload/:id', async(req, res, next) => {
    const { id } = req.params;
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({
            msg: 'No files were uploaded.'
        });

    }
    const user = await User.findById(id);

    if (user.img) {
        if (!user.img.includes('google')) {
            const nombreArr = user.img.split('/');
            const nombre = nombreArr[nombreArr.length - 1];
            const [public_id] = nombre.split('.');
            cloudinary.uploader.destroy(public_id);
        }
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    user.img = secure_url;
    await user.save();

    res.json({ "msg": "uploads" });
});


router.put("/user-profile/:id", async(req, res, next) => {
    const { email, img } = req.body;
    const { id } = req.params;
    if (!id) {
        res.json({ "msg": "missing params", "req.params": req.params });
    }
    if (!email && !img) {
        res.json({ "msg": "missing params", "req.body": req.body });
    }

    const user = await User.findByIdAndUpdate(id, { email, img }, { new: true });
    res.json({
        "msg": "put user profile",
        "user": user
    })
});


router.put("/updateUsername/:id", async(req, res, next) => {
    const { username } = req.body;
    const { id } = req.params;
    if (!id || !username) {
        res.json({ "msg": "missing params", "req.params": req.params, "req.body": req.body });
    }

    const userName = await User.findOne({ username });
    if (!userName) {
        const user = await User.findByIdAndUpdate(id, { username }, { new: true });
        res.json({
            "msg": "put user profile",
            "user": user
        });
    } else {
        res.json({
            "msg": " username taken",
        });
    }
});

router.put("/updatePassword/:id", validatePasswords,
    async(req, res, next) => {
        const { password } = req.body;
        const { id } = req.params;

        const salt = bcryptjs.genSaltSync(10);
        const newPassword = bcryptjs.hashSync(password, salt);

        if (!id) {
            res.json({ "msg": "missing params", "req.params": req.params, "req.body": req.body })
        }
        const user = await User.findByIdAndUpdate(id, { password: newPassword });
        res.json({
            "msg": "update password"
        });
    });

router.delete("/", async(req, res, next) => {
    try {
        const { id } = req.params;
        console.log("req.params ", id)
        if (!id) {
            return res.json({
                "msg": "error no data"
            });
        }
        const user = await User.findByIdAndUpdate(id, { active: false }, { new: true });
        return res.json({
            "msg": "delete user"
        });

    } catch (e) {
        return res.json({
            "msg": "error",
            "e": e
        });
    }
});


module.exports = router;