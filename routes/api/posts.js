const express = require("express");
const Post = require("../../models/Post");
const User = require("../../models/User");
const app = express();
const router = express.Router();

app.use(express.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {
  Post.find()
    .populate("postedBy")
    .sort({ createdAt: -1 })
    .then((results) => res.status(200).send(results))
    .catch((e) => res.status(404).send(e.message));
});

router.post("/", async (req, res, next) => {
  if (!req.body.content) {
    return res.status(400).send("No Content Found!!");
  }
  const postData = {
    content: req.body.content,
    postedBy: req.session.user,
  };

  Post.create(postData)
    .then(async (newPost) => {
      const result = await newPost.populate("postedBy");
      res.status(201).send(result);
    })
    .catch((e) => res.status(400).send(e.message));
});

module.exports = router;
