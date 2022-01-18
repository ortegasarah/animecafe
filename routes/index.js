const router = require("express").Router();
const axios = require('axios');

router.get("/", async(req, res, next) => {
    try {
        response_articles = await axios.get('https://api.jikan.moe/v3/top/anime/1/upcoming');
        articles = response_articles.data.top.slice(0, 6);
        response_top = await axios.get('https://api.jikan.moe/v3/top/anime/1');
        top = response_top.data.top.slice(0, 6);
        data = {
            articles,
            top
        };
        res.render("index", data);
    } catch (e) {
        res.render("error");
    }
});

router.get("/error", async(req, res, next) => {

    res.render("error");


});
module.exports = router;