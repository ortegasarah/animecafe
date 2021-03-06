const router = require("express").Router();
const Anime = require("../models/Manga.model");
const axios = require("axios");
const Review = require("../models/Review.model")
    /* || BROWSE || */
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
    let boards = [];
    if (req.session.currentUser) {
        const { _id: idUser } = req.session.currentUser;
        axios.get(`${process.env.ANIME_URI}/folder/getFolders/${idUser}`)
            .then(response => {
                boards = response.data.item;
            }).catch(error => {
                console.log("error", error);
                res.redirect("/");
            })
    }
    axios.get(`https://api.jikan.moe/v3/top/anime/1/upcoming`)
        .then(responseAxios => {
            const { top } = responseAxios.data;
            top.forEach(element => { element["boards"] = boards });

            res.render("main/browse", {
                results: top,
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
            res.render("main/results", {
                results: responseAxios.data.anime,
            });
        })
        .catch(error => {
            console.log("error")
            res.render("/");
        })
})

router.get("/getManga/:idMangapi", async(req, res, next) => {
    try {
        const {
            idMangapi
        } = req.params;
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


router.post("/", async(req, res, next) => {

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


router.get("/:id", async(req, res, next) => {
    try {
        let boards = [];
        const {
            id
        } = req.params

        const {
            data: reviewsApi
        } = await axios.get(`https://api.jikan.moe/v3/anime/${id}/reviews`);
        // reviews = reviews.data.slice(0, 4);
        const userReviews = await Review.find({
            mal_id: id
        }).populate("reviewer", "image_url username")
        const {
            data: mangainfo
        } = await axios.get(`https://api.jikan.moe/v3/anime/${id}`);
        const reviews = [...userReviews, ...reviewsApi.reviews]

        if (req.session.currentUser) {
            const { _id: idUser } = req.session.currentUser;
            const folders = await axios.get(`${process.env.ANIME_URI}/folder/getFolders/${idUser}`);
            boards = folders.data.item;
        }

        res.render("main/anime", {
            reviews,
            mangainfo,
            boards,
            userInSession: req.session.currentUser
        });
    } catch (e) {
        console.log("error", e)
        res.render("error");
    }
});

router.put("/:id", async(req, res, next) => {
    try {
        const {
            id
        } = req.params;
        const {
            tittle,
            img
        } = req.body;
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

router.delete("/:id", async(req, res, next) => {
    try {
        const {
            id
        } = req.params;
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