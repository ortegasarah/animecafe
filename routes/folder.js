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
            console.log(folder)
            if (folder) {
                res.render("users/folder-result", { userInSession: req.session.currentUser, folder });
            } else {
                res.render("users/folder-result", { userInSession: req.session.currentUser, folder: [] });
            }
        } else {
            res.render('');
        }

    } catch (e) {
        return res.json({
            "msg": "error",
            "e": e
        });
    }
});

router.get("/getFolders/:iduser", async(req, res, next) => {
    try {
        const { iduser } = req.params;
        console.log(req.params)
        if (!iduser) res.render("error");

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
        console.log("**********", e)
        return res.json({
            "msg": "error",
            "e": e
        });
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

        const folder = await Folder.findOne({ folderName, user: isUser });
        if (!folder) {
            const new_folder = Folder.create(data);
            console.log("created a new folder", new_folder, isUser)
            const folders = await axios.get(`http://localhost:3000/folder/getFolders/${isUser}`);
            console.log(folders)
            const contentFolder = folders.data.item;
            console.log("**************************")
            res.render('users/user-profile', { userInSession: req.session.currentUser, folders: contentFolder });
        } else {
            return res.json({
                "msg": "founded a folder"
            });
        }

    } catch (e) {
        console.log(e)
        return res.json({
            "msg": "error",
            "e": e
        });
    }



});


router.put("/addManga/:id", async(req, res, next) => {
    /**
     * params id: folder
     * summary: add a manga to folder
     */
    try {
        const { id } = req.params;
        const { idMangapi, tittle, img } = req.body;
        console.log("req.params ", id, "req.body", tittle, img)
        if (!id || !idMangapi || !img || !tittle) res.render("error");
        let manga = await Manga.findOne({ idMangapi, active: true });
        if (!manga) {
            data = {
                idMangapi,
                tittle,
                img
            };
            manga = await Manga.create(data);
        }
        const fold = await Folder.findById(id);
        let mangas = fold.contentFolder;
        mangas.push(manga._id);
        const folder = await Folder.findByIdAndUpdate(id, { contentFolder: mangas, }, { new: true })
        return res.json({
            "msg": "add  manga to folder",
            "item": folder
        });
    } catch (e) {
        return res.json({
            "msg": "error",
            "e": e
        });
    }


});


router.put("/:id", async(req, res, next) => {
    /**
     * params id: folder
     * summary: update tittle folder
     */
    try {
        const { id } = req.params;
        const { folderName } = req.body;
        console.log("req.params ", id, "req.body", folderName)
        if (!id || !folderName) res.render("error");
        const folder = await Folder.findByIdAndUpdate(id, { folderName }, { new: true });
        return res.json({
            "msg": "put manga",
            "item": folder
        });
    } catch (e) {
        return res.json({
            "msg": "error",
            "e": e
        });
    }
});



router.delete("/:id", async(req, res, next) => {
    /**
     * params id: folder
     * summary: update active folder
     */
    try {
        const { id } = req.params;
        console.log("req.params ", id)
        if (!id) res.render("error");
        const fold = await Folder.findById(id);
        if (fold.type != 2) {
            const folder = await Folder.findByIdAndUpdate(id, { active: false }, { new: true })
            return res.json({
                "msg": "delete folder",
                "item": folder
            });
        } else {
            return res.json({
                "msg": "cant eliminate this folder "
            });
        }
    } catch (e) {
        return res.json({
            "msg": "error",
            "e": e
        });
    }
});


router.delete("/deleteAmanga/:id", async(req, res, next) => {
    /**
     * params id: folder
     * summary: update active folder
     */
    try {
        const { id } = req.params;
        const { idManga } = req.body
        console.log("req.params ", id)
        if (!id || !idManga) res.render("error");
        const fold = await Folder.findById(id);
        let mangas = fold.manga;
        for (let i = 0; i < mangas.length; i++) {
            if (mangas[i] == idManga) {
                mangas.splice(i, 1);
                break
            }
        }
        const folder = await Folder.findByIdAndUpdate(id, { manga: mangas, }, { new: true })
        return res.json({
            "msg": "delete a  manga fro a  folder",
            "item": folder
        });

    } catch (e) {
        return res.json({
            "msg": "error",
            "e": e
        });
    }
});
module.exports = router;