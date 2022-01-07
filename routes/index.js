const router = require("express").Router();
const axios = require('axios');
/* GET home page */

router.get("/", async(req, res, next) => {

    try {
        response_articles = await axios.get('https://api.jikan.moe/v3/manga/1/news');
        articles = response_articles.data.articles;
        response_recommendations = await axios.get('https://api.jikan.moe/v3/manga/1/recommendations');
        recommendations = response_recommendations.data.recommendations;
        console.log("arre")
        data = {
            articles,
            recommendations
        };
        res.render("index", data);
    } catch (e) {
        res.render("error");
    }

});


module.exports = router;