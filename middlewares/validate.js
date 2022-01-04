const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
    //console.log("req", req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('auth' + req.url, { errorMessage: 'There is a error in the form' })
    }
    next();
};

const validatePasswords = (req, res, next) => {
    const { confirmpassword, password } = req.body;
    if (confirmpassword !== password) {
        return res.render('auth/signup', { errorMessage: 'Your passwords are different' });
    }
    next();
};

module.exports = {
    validate,
    validatePasswords
};