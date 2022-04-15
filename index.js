const express = require("express");
const middleware = require("./middleware");
const path = require("path");
const mongoose = require("./db");
const session = require("express-session");
const app = express();
const PORT = 5201;

const server = app.listen(PORT, () => console.log("Listening!!"));

app.set("view engine", "pug");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "twitter clone",
    resave: true,
    saveUninitialized: false,
  })
);

const loginRoute = require("./routes/login");
const registerRoute = require("./routes/register");

app.use("/login", loginRoute);
app.use("/register", registerRoute);

app.get("/", middleware.requireLogin, (req, res, next) => {
  const payload = {
    pageTitle: "Home",
    userLoggedIn: req.session.user
  };
  res.status(200).render("home", payload);
});
