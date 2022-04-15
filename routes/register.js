const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const app = express();
const router = express.Router();

app.set("view engine", "pug");
app.set("views", "views");

router.get("/", (req, res, next) => {
  res.status(200).render("register");
});

router.post("/", async (req, res, next) => {
  let { firstName, lastName, username, email, password } = req.body;
  firstName = firstName.trim();
  lastName = lastName.trim();
  let payload = req.body;
  if (firstName && lastName && username && email && password) {
    const user = await User.findOne({
      $or: [{ username: username }, { email: email }],
    }).catch((e) => {
      payload.errorMessage = "Something went wrong";
      res.status(404).render("register", payload);
    });

    if (user == null) {
      req.body.password = await bcrypt.hash(password, 10);
      User.create(req.body).then((user) => {
        req.session.user = user;
        return res.status(200).redirect("/");
      });
    } else {
      if (email == user.email) {
        payload.errorMessage = "Email already exists";
      } else {
        payload.errorMessage = "Username already exists";
      }
      res.status(404).render("register", payload);
    }
  } else {
    payload.errorMessage = "Make sure each field has a value";
    res.status(404).render("register", payload);
  }
});

module.exports = router;
