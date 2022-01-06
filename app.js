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

hbs.registerPartials(path.join(__dirname, 'views/partials'));

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);
// use session here:                 V
require('./config/session.config')(app);

// default value for title local
const projectName = "mangakafe";
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const index = require("./routes/index");
const auth = require("./routes/auth");
const users = require("./routes/users");

app.use("/", index);
app.use("/auth", auth);
app.use("/users", users);


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;