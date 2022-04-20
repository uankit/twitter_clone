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

router.put("/:id/like", async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.session.user._id;

  const isLiked =
    req.session.user.likes && req.session.user.likes.includes(postId);

  const option = isLiked ? "$pull" : "$addToSet";
  req.session.user = await User.findByIdAndUpdate(
    userId,
    { [option]: { likes: postId } },
    { new: true }
  ).catch((e) => res.status(400).send(e.message));

  const post = await Post.findByIdAndUpdate(
    postId,
    { [option]: { likes: userId } },
    { new: true }
  ).catch((e) => res.status(400).send(e.message));

  res.status(201).send(post)
});

module.exports = router;
