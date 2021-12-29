const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }
    next();
};

const validatePasswords = (req, res, next) => {
    const { confirmpassword, password } = req.body;
    if (confirmpassword !== password) {
        return res.status(400).json({ "msg": "password not equal" });
    }
    next();
};

module.exports = {
    validate,
    validatePasswords
};