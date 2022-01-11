const router = require("express").Router();

router.get("/user-profile", (req, res, next) => {
    res.render('users/user-profile', { userInSession: req.session.currentUser });
});


router.put("/user-profile", (req, res, next) => {
    res.json({
        "msg": "put user profile"
    })
});


router.delete("/user-profile", (req, res, next) => {
    res.json({
        "msg": "delete user profile"
    })
});


module.exports = router;