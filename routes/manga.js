const router = require("express").Router();
const Manga = require("../models/Manga.model");


router.get("/:id", async(req, res, next) => {
    try {
        const {
            id
        } = req.params

        const {
            data: reviews
        } = await axios.get(`https://api.jikan.moe/v3/manga/${id}/reviews`);

        const {
            data: mangainfo
        } = await axios.get(`https://api.jikan.moe/v3/manga/${id}`);
        console.log("reviews", reviews)
        res.render("main/manga", { reviews, mangainfo });
    } catch (e) {
        console.log("error", e)
        res.render("error");
    }
});

router.get("/:idMangapi", async(req, res, next) => {
    const { idMangapi } = req.params;
    console.log(req.params)
    if (!idMangapi) {
        return res.json({ "msg": "error no data" });
    }
    const mangadb = await Manga.findOne({ idMangapi, active: true });

    if (mangadb) {
        return res.json({
            "msg": "get manga",
            "item": mangadb
        })
    } else {
        return res.json({
            "msg": "not found"
        });
    }
});


router.post("/", async(req, res, next) => {

    try {
        const { idMangapi, tittle, img } = req.body;
        if (!idMangapi || !tittle) {
            return res.json({ "msg": "error no data", "body": req.body });
        }

        const mangadb = await Manga.findOne({ idMangapi });
        if (!mangadb) {
            data = {
                idMangapi,
                tittle,
                img
            };
            const manga = Manga.create(data);
        } else {
            console.log("founded a manga");
        }

        return res.json({
            "msg": "created"
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
        const { tittle, img } = req.body;
        console.log("req.params ", id, "req.body", tittle, img)
        if (!id || !tittle || !img) {
            return res.json({
                "msg": "error no data"
            });
        }
        const mangadb = await Manga.findByIdAndUpdate(id, { tittle, img }, { new: true })
        if (mangadb) {
            return res.json({
                "msg": "put manga",
                "item": mangadb
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
        const mangadb = await Manga.findByIdAndUpdate(id, { active: false }, { new: true })
        if (mangadb) {
            return res.json({
                "msg": "delete manga",
                "item": mangadb
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