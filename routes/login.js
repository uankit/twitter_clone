const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const app = express();
const router = express.Router();

app.set("view engine", "pug");
app.set("views", "views");

router.get("/", (req, res, next) => {
  res.status(200).render("login");
});

router.post("/", async (req, res, next) => {
  let payload = req.body;
  if (req.body.logUserName && req.body.logPassword) {
    const user = await User.findOne({
      $or: [{ username: req.body.logUserName }, { email: req.body.logUserName }],
    }).catch((e) => {
      payload.errorMessage = "Something went wrong";
      res.status(404).render("login", payload);
    });

    if (user !== null) {
      const result = await bcrypt.compare(req.body.logPassword, user.password);
      if (result) {
        req.session.user = user;
        return res.status(200).redirect("/");
      } else {
        payload.errorMessage = "Incorrect Password";
        return res.status(404).render("login", payload);
      }
    }
  }
  res.status(200).render("login");
});

module.exports = router;
