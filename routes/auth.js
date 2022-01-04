const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const { googleVerify } = require("../helpers/google-verify");
const User = require("../models/User.model");
const { check } = require('express-validator');
const { validate, validatePasswords } = require("../middlewares/validate");


/**
 * #################################### SIGNUP ####################################################
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
            const salt = bcryptjs.genSaltSync(10);
            const newPassword = bcryptjs.hashSync('', salt);
            const data = {
                email,
                name,
                img,
                password: newPassword,
                google: true
            };
            user = await User.create(data);
            req.session.currentUser = user;
            res.redirect('/users/user-profile');
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
            const user = await User.create(data);
            req.session.currentUser = user;
            res.redirect('/users/user-profile');
        } else {
            res.render('auth/signup', { errorMessage: 'Email is already registered. Try to login' });
        }
    } catch (error) {
        console.log(error)
        res.send("error")
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
        user = await User.findOne({ email });
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
    check('id_token', 'token is required').not().isEmpty()
], async(req, res, next) => {
    const { id_token } = req.body;
    try {
        const { email } = await googleVerify(id_token);
        let user = await User.findOne({ email, google: true });
        if (!user) {
            res.render('auth/login', { errorMessage: 'Email is already registered. Try to login' });
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


module.exports = router;