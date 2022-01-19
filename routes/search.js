const router = require("express").Router();
const axios = require("axios")

router.get("/", (req, res, next) => {
    console.log(req.query)
    if (Object.keys(req.query).length) {
        const {
            title
        } = req.query
        let score = "title"
        axios.get(`https://api.jikan.moe/v3/search/anime?q=${title}&page=1&order_by=${score}`)
            .then(responseAxios => {
                console.log(responseAxios.data)
                res.render("main/results", {
                    results: responseAxios.data.results,
                    userInSession: req.session.currentUser
                });
            })
            .catch(error => {
                console.log("error")
                res.render("/");
            })

    } else {
        res.render("/");
    }
});


// https://api.jikan.moe/v3/search/anime?q=&order_by=score&sort=desc&page=1
// https://api.jikan.moe/v3/search/anime?q=&order_by=title&sort=desc&page=1
// https://api.jikan.moe/v3/search/anime?q=${title}&order_by=title&sort=asc&page=1

module.exports = router;