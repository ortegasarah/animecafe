const router = require("express").Router();
const Review = require("../models/Review.model");

//GET REVIEWS
router.get("/:idMangapi", async(req, res, next) => {
    const { idMangapi } = req.params;
    if (!idMangapi) res.render("error");
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

//ADD REVIEW
router.post("/", async(req, res, next) => {
    try {
        const { iduser, mal_id, content } = req.body;
        if (!iduser || !mal_id || !content) res.render("error");
        data = {
            mal_id,
            reviewer: iduser,
            content
        };
        const review = await Review.create(data);
        res.redirect(`/anime/${mal_id}`)
    } catch (e) {
        next(e)
    }
});

//ACTUALIZE REVIEW
router.put("/:id", async(req, res, next) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        if (!id || !description) res.render("error");
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

//DELETE REVIEW
router.delete("/:id", async(req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) res.render("error");
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