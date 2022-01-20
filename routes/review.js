const router = require("express").Router();
const Review = require("../models/Review.model");

//GET REVIEWS
router.get("/:idMangapi", async(req, res, next) => {
    const { idMangapi } = req.params;
    console.log(req.params)
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
        const { iduser, idMangapi, description } = req.body;
        if (!iduser || !idMangapi || !description) res.render("error");
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

//ACTUALIZE REVIEW
router.put("/:id", async(req, res, next) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        console.log("req.params ", id, "req.body", description)
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
        console.log("req.params ", id)
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