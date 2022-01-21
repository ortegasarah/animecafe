const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const axios = require("axios");
const { v4: uuidv4 } = require('uuid');
const { check } = require('express-validator');

const User = require("../models/User.model");

const { googleVerify } = require("../helpers/google-verify");
const { sendEmail } = require("../helpers/send-email");
const { validate } = require("../middlewares/validate");
const { validatePassword } = require("../helpers/validate-password");

/**
 * #################################### SIGNUP ####################################################
 */

router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});

router.post("/signupgoogle", [
    check('id_token', 'token is required').not().isEmpty(),
    validate
], async(req, res, next) => {
    const { id_token } = req.body;
    try {
        const { email, name, picture: image_url, idGoogle } = await googleVerify(id_token);
        const user = await User.findOne({ idGoogle });
        console.log(user)

        if (!user) {
            const salt = bcryptjs.genSaltSync(10);
            const newPassword = bcryptjs.hashSync('', salt);
            const username = uuidv4() + email.split("@")[0];
            const data = {
                email,
                name,
                image_url,
                password: newPassword,
                google: true,
                username,
                idGoogle
            };
            userdb = await User.create(data);
            const { _id: idUser } = userdb;
            req.session.currentUser = userdb;
            axios.post(`${process.env.ANIME_URI}/folder/`, {
                "isUser": idUser,
                "folderName": "favorites",
                "type": 2
            });
            res.redirect('/users/user-profile');
        } else {
            res.render('auth/signup', { errorMessage: 'Email is already registered. Try to login' });
        }

    } catch (error) {
        console.log(error);
        res.send("error");
    }

});

router.post("/signup", [
    check('email', 'email is required').not().isEmpty(),
    check('email', 'email invalid').isEmail(),
    check('name', 'name is required').not().isEmpty(),
    validate
], async(req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const salt = bcryptjs.genSaltSync(10);
        const newPassword = bcryptjs.hashSync(password, salt);
        const userdb = await User.findOne({ email });
        const username = uuidv4() + email.split("@")[0];
        if (!userdb) {
            const data = {
                name,
                email,
                password: newPassword,
                username
            }
            const user = await User.create(data);
            const { _id: idUser } = user;
            req.session.currentUser = user;
            axios.post(`${process.env.ANIME_URI}/folder/`, {
                "isUser": idUser,
                "folderName": "favorites",
                "type": 2
            });
            res.redirect('/users/user-profile');
        } else {
            res.render('auth/signup', { errorMessage: 'Email is already registered. Try to login' });
        }
    } catch (error) {
        console.log(error);
        res.send("error");
    }
});

/**
 * #################################### LOGIN ####################################################
 */

router.get("/login", (req, res, next) => {
    res.render("auth/login");
});

router.post("/login", [
    check('email', 'email is required').not().isEmpty(),
    check('email', 'email invalid').isEmail(),
    check('password', 'password is invalid').not().isEmpty(),
    validate
], async(req, res, next) => {
    const { email, password } = req.body;

    try {
        user = await User.findOne({ email, active: true });
        if (!user) {
            res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
            return;
        } else if (bcryptjs.compareSync(password, user.password)) {
            req.session.currentUser = user;
            res.redirect('/users/user-profile');
        } else {
            res.render('auth/login', { errorMessage: 'Incorrect password.' });
        }
    } catch (err) {
        next(err)
    }
});


router.post("/loginggoogle", [
    check('id_token', 'token is required').not().isEmpty(),
    validate
], async(req, res, next) => {
    const { id_token } = req.body;
    try {
        const { idGoogle } = await googleVerify(id_token);
        let user = await User.findOne({ idGoogle, google: true, active: true });
        if (!user) {
            res.render('auth/login', { errorMessage: 'Email is not registered. signup' });
        } else {
            req.session.currentUser = user;
            res.redirect('/users/user-profile');
        }
    } catch (error) {
        console.log(error)
    }
})



/**
 * #################################### LOGOUT ####################################################
 */

router.post('/logout', (req, res, next) => {
    req.session.destroy(err => {
        if (err) next(err);
        res.redirect('/');
    });
});


/**
 * #################################### FORGOT THE PASSWORD ####################################################
 */

router.get("/forgot_password", (req, res, next) => {
    res.render("auth/forgotPassword");
});



router.post("/forgot_password", async(req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.render("error");
        }
        const user = await User.findOne({ email });
        console.log(user)
        if (user) {
            data = { url: `${process.env.ANIME_URI}/auth/reset_password/${user.id}` }
            sendEmail(email, data, 'd-eb14ae8bf8924318a727ec3390616d61')
        }
        res.render('auth/forgotPassword', { errorMessage: 'We send you an email' });

    } catch (err) {
        return res.json({
            "msg": "error",
            "err": err
        });
    }
});


router.get("/reset_password/:id", async(req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (user) {
        req.session.idUser = id;
        res.render("auth/resetPassword");
    } else {
        res.render("auth/resetPassword", { errorMessage: 'sorry we have a problem' });
    }

});


router.post("/reset_password", async(req, res, next) => {
    try {
        const { password, confirmpassword } = req.body;

        const { status, msg } = validatePassword(password, confirmpassword)
        if (status == 200) {
            const { idUser } = req.session;
            const user = await User.findById(idUser);
            const salt = bcryptjs.genSaltSync(10);
            const newPassword = bcryptjs.hashSync(password, salt);
            user.password = newPassword;
            await user.save();
            res.render("auth/login");
        } else {
            res.render("auth/resetPassword", { errorMessage: msg });
        }


    } catch (err) {
        res.render("auth/reset_password", { errorMessage: 'sorry we have a problem' });
    }
})






module.exports = router;