const router = require("express").Router();
const { response, json } = require('express');
const bcryptjs = require("bcryptjs");
const { googleVerify } = require("../helpers/google-verify");
const User = require("../models/User.model");
const { check } = require('express-validator');
const { validate, validatePasswords } = require("../middlewares/validate");

/**
 * SIGNUP
 */

router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
})

router.post("/signupgoogle", [
    check('id_token', 'token is required').not().isEmpty()
], async(req, res, next) => {
    const { id_token } = req.body;

    try {
        const { email, name, picture: img } = await googleVerify(id_token);
        let userdb = await User.findOne({ email });

        if (!userdb) {
            const data = {
                email,
                name,
                img,
                password: ':p',
                google: true
            };
            userdb = await User.create(data);
        } else {
            res.render('auth/signup', { errorMessage: 'Email is already registered. Try to login' });
        }

    } catch (error) {
        console.log(error)
    }

});

router.post("/signup", [
    check('email', 'email is required').not().isEmpty(),
    check('email', 'email invalid').isEmail(),
    check('name', 'name is required').not().isEmpty(),
    check('password', 'password is invalid').not().isEmpty().matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/),
    check('confirmpassword', 'confirmpassword is required').not().isEmpty().matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/),
    validatePasswords, validate
], async(req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const salt = bcryptjs.genSaltSync(10);
        const newPassword = bcryptjs.hashSync(password, salt);

        const userdb = await User.findOne({ email });
        if (!userdb) {

            const data = {
                name,
                email,
                password: newPassword
            }
            console.log("no tengo usuario", data)
            const user = await User.create(data)
            res.send("created")
        } else {
            res.render('auth/signup', { errorMessage: 'Email is already registered. Try to login' });
        }
    } catch (error) {
        console.log(error)
        res.send("error")
    }
});

/**
 * LOGIN
 */

router.get("/login", (req, res, next) => {
    res.render("auth/login");
});

router.post("/login", [
    check('email', 'email is required').not().isEmpty(),
    check('email', 'email invalid').isEmail(),
    check('password', 'password is invalid').not().isEmpty()
], async(req, res, next) => {

    const { email, password } = req.body;

    try {
        user = await User.findOne({ email });
        if (!User) {
            res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
            return;
        } else if (bcryptjs.compareSync(password, user.password)) {
            const userPs = user.toObject();
            delete userPs['password'];
            req.session.currentUser = userPs;
            res.redirect('/profile');
        } else {
            res.render('auth/login', { errorMessage: 'Incorrect password.' });
        }
    } catch (err) {

    }
});


router.post("/loginggoogle", [
    check('id_token', 'token is required').not().isEmpty()
], async(req, res, next) => {
    const { id_token } = req.body;

    try {
        const { email } = await googleVerify(id_token);
        let userdb = await User.findOne({ email, google: True });

        if (!userdb) {
            res.render('auth/login', { errorMessage: 'Email is already registered. Try to login' });
        } else {
            req.session.currentUser = userPs;
            res.redirect('/profile');
        }


    } catch (error) {
        console.log(error)
    }
})



module.exports = router;