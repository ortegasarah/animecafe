// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");
const path = require('path');

const fileUpload = require('express-fileupload');

hbs.registerPartials(path.join(__dirname, 'views/partials'));

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
// upload files
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);
// use session here:                 V
require('./config/session.config')(app);

// default value for title local
const projectName = "mangakafe";
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}`;

//Register partials
// hbs.registerPartials(path.join(__dirname, 'views/partials'));

// 👇 Start handling routes here
const index = require("./routes/index");
const auth = require("./routes/auth");
const users = require("./routes/users");
const search = require("./routes/search");
const anime = require("./routes/anime");
const folder = require("./routes/folder");
const review = require("./routes/review");



app.use("/", index);
app.use("/auth", auth);
app.use("/users", users);
app.use("/search", search);
app.use("/anime", anime);
app.use("/folder", folder);
app.use("/review", review);




// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;