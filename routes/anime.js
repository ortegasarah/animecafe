const router = require("express").Router();
const Anime = require("../models/Manga.model");
const axios = require("axios");

/* BROWSE */
router.get("/browse", (req, res, next) => {
    const genres = [{
        label: "Action",
        id: 1
    }, {
        label: "Adventure",
        id: 2
    }, {
        label: "Comedy",
        id: 4
    }, {
        label: "Fantasy",
        id: 10
    }, {
        label: "Horror",
        id: 14
    }, {
        label: "Martial Arts",
        id: 17
    }, {
        label: "Romance",
        id: 22
    }, {
        label: "Sci Fi",
        id: 24
    }, {
        label: "Space",
        id: 29
    }, {
        label: "Super Power",
        id: 31
    }]
    axios.get(`https://api.jikan.moe/v3/top/anime/1/upcoming`)
        .then(responseAxios => {
            console.log(responseAxios.data.top)
            res.render("main/browse", {
                results: responseAxios.data.top,
                genres
            });
        })
        .catch(error => {
            console.log("error")
            res.render("/");
        })
});

router.get("/genres/:id", (req, res) => {
    const {
        id
    } = req.params;
    axios.get(`https://api.jikan.moe/v3/genre/anime/${id}/1`)
        .then(responseAxios => {
            console.log(responseAxios)
            res.render("main/results", {
                results: responseAxios.data.anime,
            });
        })
        .catch(error => {
            console.log("error")
            res.render("/");
        })

    const getGenre = (idGenre) => {
        switch (idGenre) {
            case 1: return ({action:true, label: "Action"})
            case 2: return ({action:true, label: "Adventure"})
            case 3: return ({action:true, label: "Comedy"})
            case 4: return ({action:true, label: "Fantasy"})
            case 5: return ({action:true, label: "Horror"})
            case 6: return ({action:true, label: "Martial Arts"})
            case 7: return ({action:true, label: "Romance"})
            case 8: return ({action:true, label: "Sci Fi"})
            case 9: return ({action:true, label: "Space"})
            case 10: return ({action:true, label: "Super Power"})
        }
    }
    res.render('main/results', {
        headerGenre: getGenre(req.params.genero_id)})
})

router.get("/getManga/:idMangapi", async (req, res, next) => {
    try {
        const {
            idMangapi
        } = req.params;
        console.log(req.params)
        if (!idMangapi) {
            return res.json({
                "msg": "error no data"
            });
        }
        const mangadb = await Anime.findOne({
            idMangapi,
            active: true
        });

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
    } catch (e) {
        return res.json({
            "msg": "error",
            "e": e
        });
    }

});


router.post("/", async (req, res, next) => {

    try {
        const {
            idMangapi,
            tittle,
            img
        } = req.body;
        if (!idMangapi || !tittle) res.render("error");

        const mangadb = await Anime.findOne({
            idMangapi
        });
        if (!mangadb) {
            data = {
                idMangapi,
                tittle,
                img
            };
            const manga = await Anime.create(data);
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


router.get("/:id", async (req, res, next) => {
    try {
        const {
            id
        } = req.params

        const {
            data: reviews
        } = await axios.get(`https://api.jikan.moe/v3/anime/${id}/reviews`);
        // reviews = reviews.data.slice(0, 4);

        const {
            data: mangainfo
        } = await axios.get(`https://api.jikan.moe/v3/anime/${id}`);
        console.log("reviews", reviews)
        res.render("main/anime", {
            reviews,
            mangainfo
        });
    } catch (e) {
        console.log("error", e)
        res.render("error");
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        const {
            id
        } = req.params;
        const {
            tittle,
            img
        } = req.body;
        console.log("req.params ", id, "req.body", tittle, img)
        if (!id || !tittle || !img) {
            return res.json({
                "msg": "error no data"
            });
        }
        const mangadb = await Anime.findByIdAndUpdate(id, {
            tittle,
            img
        }, {
            new: true
        })
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

router.delete("/:id", async (req, res, next) => {
    try {
        const {
            id
        } = req.params;
        console.log("req.params ", id)
        if (!id) {
            return res.json({
                "msg": "error no data"
            });
        }
        const mangadb = await Anime.findByIdAndUpdate(id, {
            active: false
        }, {
            new: true
        })
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