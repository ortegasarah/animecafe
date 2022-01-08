const router = require("express").Router();
const axios = require("axios")
/* GET home page */
router.get("/", (req, res, next) => {
    console.log("los query params", req.query)
    if (Object.keys(req.query).length) {
        const {
            title
        } = req.query
        let score = "title"
        axios.get(`https://api.jikan.moe/v3/search/manga?q=${title}&page=1&order_by=${score}`)
            .then(responseAxios => {
                console.log(responseAxios.data)
                res.render("main/results", {
                    results: responseAxios.data.results
                });
            })
            .catch(error => {
                console.log("error")
                res.render("header/search");
            })

    } else {
        res.render("header/search");
    }
});


module.exports = router;