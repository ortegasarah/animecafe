const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

async function googleVerify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
        // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const { name, picture, email, sub, ...rest } = ticket.getPayload();
    return {
        email,
        name,
        picture,
        idGoogle: sub
    };
}

module.exports = {
    googleVerify
};