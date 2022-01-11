const router = require("express").Router();


router.get("/", (req, res, next) => {
    res.json({
        "msg": "get folder"
    })
});


router.post("/", (req, res, next) => {

    res.json({
        "msg": "post folder"
    })
});


router.put("/", (req, res, next) => {
    res.json({
        "msg": "put folder"
    })
});

router.delete("/", (req, res, next) => {
    res.json({
        "msg": "delete folder"
    });
});

module.exports = router;