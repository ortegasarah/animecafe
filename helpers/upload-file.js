const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

async function uploadFile(user, archivo) {
    try {
        if (user.image_url) {
            if (!user.image_url.includes('google') || !user.image_url.includes('notFound_wpeppw.jpg')) {
                const nombreArr = user.image_url.split('/');
                const nombre = nombreArr[nombreArr.length - 1];
                const [public_id] = nombre.split('.');
                cloudinary.uploader.destroy(public_id);
            }
        }

        const { tempFilePath } = archivo;
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

        return secure_url

    } catch (e) {
        console.log("error to upload the file ", e);
        return false;
    }
}

module.exports = {
    uploadFile
};