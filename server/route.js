const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
router.use(bodyParser.json());
const commentRouter = require("./routes/comment")

const userRouter = require("./routes/userRoute")
const postRouter = require("./routes/postroute")




router.use(commentRouter);
router.use(postRouter);
router.use(userRouter);

// POST route to create a new user
router.get("/", (req, res) => {
  res.send("hello world  from backend");
});




module.exports = router;
