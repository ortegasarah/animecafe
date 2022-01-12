const router = require("express").Router();
const axios = require("axios");

router.get("/user-profile", async(req, res, next) => {
    if (req.session.currentUser) {
        const { _id: idUser } = req.session.currentUser
        const folders = await axios.get(`http://localhost:3000/folder/getFolders/${idUser}`);
        console.log(folders.data)
        res.render('users/user-profile', { userInSession: req.session.currentUser, folders: folders.data });
    } else {
        res.render('');
    }

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