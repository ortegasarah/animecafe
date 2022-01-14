const router = require("express").Router();
const Review = require("../models/Review.model");


router.get("/:idMangapi", async(req, res, next) => {
    const { idMangapi } = req.params;
    console.log(req.params)
    if (!idMangapi) {
        return res.json({ "msg": "error no data" });
    }
    const reviews = await Review.findOne({ idMangapi, active: true }).populate('user');
    if (reviews) {
        return res.json({
            "msg": "get reviews",
            "item": reviews
        })
    } else {
        return res.json({
            "msg": "not found"
        });
    }
});


router.post("/", async(req, res, next) => {
    try {
        const { iduser, idMangapi, description } = req.body;
        if (!iduser || !idMangapi || !description) {
            return res.json({ "msg": "error no data", "body": req.body });
        }
        data = {
            idMangapi,
            user: iduser,
            description
        };
        const review = await Review.create(data);

        return res.json({
            "msg": "created",
            "item": review
        });
    } catch (e) {
        return res.json({
            "msg": "error",
            "e": e
        });
    }



});


router.put("/:id", async(req, res, next) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        console.log("req.params ", id, "req.body", description)
        if (!id || !description) {
            return res.json({
                "msg": "error no data"
            });
        }
        const review = await Review.findByIdAndUpdate(id, { description }, { new: true });
        if (review) {
            return res.json({
                "msg": "put review",
                "item": review
            });
        }
    } catch (e) {
        return res.json({
            "msg": "error",
            "e": e
        });
    }


});

router.delete("/:id", async(req, res, next) => {
    try {
        const { id } = req.params;
        console.log("req.params ", id)
        if (!id) {
            return res.json({
                "msg": "error no data"
            });
        }
        const review = await Review.findByIdAndUpdate(id, { active: false }, { new: true })
        if (review) {
            return res.json({
                "msg": "delete review",
                "item": review
            });
        }
    } catch (e) {
        return res.json({
            "msg": "error",
            "e": e
        });
    }
});

module.exports = router;