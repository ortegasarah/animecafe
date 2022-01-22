const router = require("express").Router();
const axios = require("axios")

router.get("/", (req, res, next) => {
    if (Object.keys(req.query).length) {
        let {
            title,
            page
        } = req.query
        if (!page) {
            page = 1
        }
        let score = "title";
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

        axios.get(`https://api.jikan.moe/v3/search/anime?q=${title}&page=${page}&order_by=${score}`)
            .then(responseAxios => {
                const { results } = responseAxios.data;
                results.forEach(element => { element["boards"] = boards });
                res.render("main/results", {
                    results,
                    /* || ADD PAGINATION || */
                    pagination: {
                        page: Number(page) + 1,
                        limit: 7,
                        totalRows: 5,
                        queryParams: { title, page }
                    },

                    userInSession: req.session.currentUser

                });
            })
            .catch(error => {
                console.log("error", error)
                res.redirect("/");
            })

    } else {
        res.redirect("/");
    }
});


// https://api.jikan.moe/v3/search/anime?q=&order_by=score&sort=desc&page=1
// https://api.jikan.moe/v3/search/anime?q=&order_by=title&sort=desc&page=1
// https://api.jikan.moe/v3/search/anime?q=${title}&order_by=title&sort=asc&page=1

module.exports = router;