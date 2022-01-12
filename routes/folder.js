const router = require("express").Router();
const Folder = require("../models/Folder.model");
const Manga = require("../models/Manga.model");


router.get("/:id", async(req, res, next) => {
    try {
        const { id } = req.params;
        console.log(req.params)
        if (!id) {
            return res.json({ "msg": "error no data", "req.params": req.params });
        }
        const folder = await Folder.findOne({ id, active: true })
            .populate("contentFolder")
            .populate("user");

        if (folder) {
            return res.json({
                "msg": "get folder",
                "item": folder
            });
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

router.get("/getFolders/:iduser", async(req, res, next) => {
    try {
        const { iduser } = req.params;
        console.log(req.params)
        if (!iduser) {
            return res.json({ "msg": "error no data", "body": req.body });
        }
        const folders = await Folder.find({ user: iduser, active: true })
            .populate("contentFolder")
            .populate("user");

        if (folders) {
            return res.json({
                "msg": "get folders",
                "item": folders
            });
        } else {
            return res.json({
                "msg": "not found"
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
        const { isUser, folderName } = req.body;
        if (!isUser || !folderName) {
            return res.json({ "msg": "error no data", "body": req.body });
        }

        const folder = await Folder.findOne({ folderName });
        if (!folder) {
            data = {
                user: isUser,
                folderName
            };
            const manga = Folder.create(data);
        } else {
            console.log("founded a folder");
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


router.put("/addManga/:id", async(req, res, next) => {
    /**
     * params id: folder
     * summary: add a manga to folder
     */
    try {
        const { id } = req.params;
        const { idMangapi, tittle, img } = req.body;
        console.log("req.params ", id, "req.body", tittle, img)
        if (!id || !idMangapi || !img || !tittle) {
            return res.json({
                "msg": "error no data",
                "req.params": req.params,
                "req.body": req.body
            });
        }
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
        if (!id || !folderName) {
            return res.json({
                "msg": "error no data",
                "req.params": req.params,
                "req.body": req.body
            });
        }
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
        if (!id) {
            return res.json({
                "msg": "error no data"
            });
        }
        const folder = await Folder.findByIdAndUpdate(id, { active: false }, { new: true })
        return res.json({
            "msg": "delete folder",
            "item": folder
        });

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
        if (!id || !idManga) {
            return res.json({
                "msg": "error no data"
            });
        }
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