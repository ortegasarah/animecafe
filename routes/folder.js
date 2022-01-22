const router = require("express").Router();
const Folder = require("../models/Folder.model");
const Manga = require("../models/Manga.model");
const axios = require("axios");


router.get("/:id", async(req, res, next) => {
    try {
        const { id } = req.params;
        if (req.session.currentUser && id) {
            //console.log(req.session.currentUser)
            const folder = await Folder.findOne({ _id: id, active: true })
                .populate("contentFolder");
            //.populate("user");
            //console.log("*****", folder)
            if (folder) {
                res.render("users/folder-result", { userInSession: req.session.currentUser, folder });
            } else {
                res.render("users/folder-result", { userInSession: req.session.currentUser, folder: [] });
            }
        } else {
            res.render('');
        }

    } catch (e) {
        console.log(e);
        res.render("error");
    }
});

router.get("/getFolders/:iduser", async(req, res, next) => {
    try {
        const { iduser } = req.params;
        console.log(req.params)
        if (!iduser) {
            const { _id: idUSer } = req.session.currentUser
            res.render("error")
        };

        if (!iduser) {
            res.render("error")
        };

        const folders = await Folder.find({ user: iduser, active: true })
            .populate("contentFolder")
            //.populate("user");

        if (folders) {
            return res.json({
                "msg": "get folders",
                "item": folders
            });
        } else {
            return res.json({
                "msg": "not found",
                "item": []
            });
        }
    } catch (e) {
        console.log(e);
        res.render("error");
    }
});


router.post("/", async(req, res, next) => {

    try {
        const { isUser, folderName, type } = req.body;
        let data = { user: "", folderName: "" }
        if (!isUser || !folderName) {
            res.render("error");
        } else {
            data["user"] = isUser;
            data["folderName"] = folderName;
        }

        if (type) data["type"] = type;

        const folder = await Folder.findOne({ folderName, user: isUser, active: true });
        if (folder) { console.log("folder alredy exist"); }

        const new_folder = Folder.create(data);
        //console.log("created a new folder", new_folder, isUser)
        const folders = await axios.get(`${process.env.ANIME_URI}/folder/getFolders/${isUser}`);
        //console.log(folders)
        const contentFolder = folders.data.item;
        res.redirect('/users/user-profile');

    } catch (e) {
        console.log(e);
        res.render("error");
    }



});

router.get("/addAnime/:idManga/liked", async(req, res, next) => {
    try {
        const { idManga } = req.params;
        if (!req.session.currentUser) {
            res.redirect("/auth/login");
        }

        const { data: mangainfo } = await axios.get(`https://api.jikan.moe/v3/anime/${idManga}`);
        const { mal_id: idMangapi, title: tittle, image_url: img } = mangainfo;

        //console.log("req.params ", idManga, "mangainfo", mangainfo)

        let manga = await Manga.findOne({ idMangapi, active: true });
        if (!manga) {
            data = {
                idMangapi,
                tittle,
                img
            };
            manga = await Manga.create(data);
        }
        const fold = await Folder.findOne({ user: req.session.currentUser._id, folderName: "favorites" })
        let mangas = fold.contentFolder;
        mangas.push(manga._id);
        const folder = await Folder.findByIdAndUpdate(fold._id, { contentFolder: mangas, }, { new: true })
        res.redirect("/");
    } catch (e) {
        console.log(e)
        res.render("error");
    }
});


router.get("/addAnime/:idAnime/board/:id", async(req, res, next) => {
    /**
     * params id: folder
     * summary: add a manga to folder
     */
    try {
        const { idAnime: idManga, id } = req.params;
        if (!req.session.currentUser) {
            res.redirect("/auth/login");
        }

        const { data: mangainfo } = await axios.get(`https://api.jikan.moe/v3/anime/${idManga}`);
        const { mal_id: idMangapi, title: tittle, image_url: img } = mangainfo;

        let manga = await Manga.findOne({ idMangapi, active: true });
        if (!manga) {
            data = {
                idMangapi,
                tittle,
                img
            };
            manga = await Manga.create(data);
        }
        const fold = await Folder.findById(id)
        let mangas = fold.contentFolder;
        mangas.push(manga._id);
        const folder = await Folder.findByIdAndUpdate(fold._id, { contentFolder: mangas, }, { new: true })
        res.redirect("/");
    } catch (e) {
        console.log(e);
        res.render("error");
    }
});


router.post("/update/:id", async(req, res, next) => {
    try {
        console.log("updating")
        const { id } = req.params;
        const { folderName } = req.body;
        const { _id: isUser } = req.session.currentUser
        if (!id || !folderName) res.render("error");
        const folder = await Folder.findByIdAndUpdate(id, { folderName }, { new: true })


        const folders = await axios.get(`${process.env.ANIME_URI}/folder/getFolders/${isUser}`);
        const contentFolder = folders.data.item;
        res.render('users/user-profile', { userInSession: req.session.currentUser, folders: contentFolder });

    } catch (e) {
        console.log(e);
        res.render("error");
    }
});



router.post("/delete/:id", async(req, res, next) => {
    try {
        const { id } = req.params;
        const { _id: isUser } = req.session.currentUser

        if (!id || !isUser) res.render("error");
        const fold = await Folder.findById(id);
        console.log("fold: ", fold)
        if (fold.type != 2) {
            const folder = await Folder.findByIdAndUpdate(id, { active: false })
            console.log("folder deleted", folder)
        } else { console.log("cant eliminate this folder "); }

        const folders = await axios.get(`${process.env.ANIME_URI}/folder/getFolders/${isUser}`);
        const contentFolder = folders.data.item;
        res.render('users/user-profile', { userInSession: req.session.currentUser, folders: contentFolder });

    } catch (e) {
        console.log(e);
        res.render("error");
    }
});


router.post("/deleteAnime/:id", async(req, res, next) => {
    /**
     * params id: folder
     * summary: update active folder
     */
    try {
        const { id } = req.params;
        const { idAnime } = req.body
        console.log("req.params ", id, "req.body", idAnime)
        if (!id || !idAnime) res.render("error");
        const fold = await Folder.findById(id);
        console.log(fold)
        let animes = fold.contentFolder;
        for (let i = 0; i < animes.length; i++) {
            console.log(animes[i], idAnime)
            if (animes[i] == idAnime) {
                console.log("entre")
                animes.splice(i, 1);
                break
            }
        }
        console.log(animes)
        const folder = await Folder.findByIdAndUpdate(id, { contentFolder: animes, }, { new: true })
        res.redirect(`/folder/${id}`);

    } catch (e) {
        console.log(e);
        res.render("error");
    }
});
module.exports = router;