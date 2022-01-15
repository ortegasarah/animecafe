const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('auth' + req.url, { errorMessage: 'password is invalid' });
    }
    next();
};

module.exports = {
    validate
};