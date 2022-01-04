const router = require("express").Router();

router.get("/user-profile", (req, res, next) => {
    res.render('users/user-profile', { userInSession: req.session.currentUser });
});

module.exports = router;