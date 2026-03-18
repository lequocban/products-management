const express = require("express");
const database = require("./config/database.js");

const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");

require("dotenv").config();

database.connect();

const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");

const systemConfig = require("./config/system.js");

const app = express();

app.use(methodOverride("_method"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());

//express flash
app.use(cookieParser("le quoc ban dep trai"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
//end   express flash

const port = process.env.PORT;

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

//app local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static(`${__dirname}/public`));

//Routes
route(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
