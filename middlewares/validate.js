const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('auth' + req.url, { errorMessage: 'password is invalid' });
    }
    next();
};


const validatePasswords = (req, res, next) => {
    const { confirmpassword, password } = req.body;
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

    if (!regex.test(password) && !regex.test(confirmpassword)) {
        return res
            .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    } else if (confirmpassword !== password) {
        return res.render('auth/signup', { errorMessage: 'Your passwords are different' });
    }
    next();
};

module.exports = {
    validate,
    validatePasswords
};