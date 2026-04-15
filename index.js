const express = require("express");
const path = require("path");
const database = require("./config/database.js");

const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const moment = require("moment");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

database.connect();

const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const chatSocket = require("./sockets/client/chat.socket");

const systemConfig = require("./config/system.js");
const { patch } = require("./routes/client/products.route.js");

const app = express();

app.use(methodOverride("_method"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());

// socket io
const server = http.createServer(app);
const io = new Server(server, {
  maxHttpBufferSize: 2e7,
});

global._io = io;
chatSocket(io);

// end socket io


//express flash
app.use(cookieParser("le quoc ban dep trai"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
//end   express flash

// tiny mce
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce")),
);
// end tiny mce

const port = process.env.PORT;

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

//app local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

app.use(express.static(`${__dirname}/public`));

//Routes
route(app);
routeAdmin(app);

app.use((req, res) => {
  res.status(404).render("client/pages/errors/404", {
    pageTitle: "Không tìm thấy trang",
  });
});
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
