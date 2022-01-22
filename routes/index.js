const router = require("express").Router();
const axios = require('axios');

router.get("/", async(req, res, next) => {
    try {
        let boards = [];
        response_articles = await axios.get('https://api.jikan.moe/v3/top/anime/1/upcoming');
        articles = response_articles.data.top.slice(0, 8);
        response_top = await axios.get('https://api.jikan.moe/v3/top/anime/1');
        top = response_top.data.top.slice(0, 8);

        if (req.session.currentUser) {
            const { _id: idUser } = req.session.currentUser;
            const folders = await axios.get(`${process.env.ANIME_URI}/folder/getFolders/${idUser}`);
            boards = folders.data.item;
        }

        articles.forEach(element => { element["boards"] = boards });
        top.forEach(element => { element["boards"] = boards });

        res.render("index", { articles, top, userInSession: req.session.currentUser });
    } catch (e) {
        console.log(e)
        res.render("error");
    }
});

router.get("/error", async(req, res, next) => {
    res.render("error");
});

module.exports = router;