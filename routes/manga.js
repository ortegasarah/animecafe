const router = require("express").Router();
const axios = require("axios")



router.get('/:id', async (req, res, next) => {
  try {
    const {
      id
    } = req.params
    const {
      data
    } = await axios.get(`https://api.jikan.moe/v3/manga/${id}`)
    console.log("data", data)
    res.render('main/manga');
    responseAxios => {
      console.log(responseAxios.data)
      res.render("main/manga", {
          manga: responseAxios.data.manga
      });
  }

  } catch (error) {
    console.log('error', error)
    res.send("error")
  }
})

module.exports = router;