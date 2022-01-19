function validatePassword(password, confirmpassword) {

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    let data = {
        "msg": 'everything is ok',
        "status": 200
    };
    if (!regex.test(password) && !regex.test(confirmpassword)) {
        return data = {
            "msg": 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.',
            "status": 401
        };
    }
    if (confirmpassword !== password) {
        return data = {
            "msg": 'Your passwords are different',
            "status": 401
        };
    }

    return data;

}

module.exports = {
    validatePassword
};