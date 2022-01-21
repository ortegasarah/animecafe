const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

async function uploadFile(user, archivo) {
    try {
        console.log("carga de archivo ************")
        console.log(user.image_url)
        if (user.image_url) {
            console.log("mi usuario tiene una imagen")
            if (!user.image_url.includes('google') || !user.image_url.includes('notFound_wpeppw.jpg')) {
                console.log("eliminando imagen")
                const nombreArr = user.image_url.split('/');
                const nombre = nombreArr[nombreArr.length - 1];
                const [public_id] = nombre.split('.');
                cloudinary.uploader.destroy(public_id);
            }
        }
        console.log("no tengo imagen del usuario")

        const { tempFilePath } = archivo;
        console.log("------------------", tempFilePath)
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
        console.log("ya la subi my friend")

        return secure_url

    } catch (e) {
        console.log("error to upload the file ", e);
        return false;
    }
}

module.exports = {
    uploadFile
};