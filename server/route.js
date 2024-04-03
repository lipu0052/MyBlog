const express = require("express");
const User = require("./schema"); // Assuming the schema/model file is named model.js
const bodyParser = require("body-parser");
const router = express.Router();
router.use(bodyParser.json());

// POST route to create a new user
router.get("/", (req, res) => {
  res.send("hello world ");
});
router.post("/signup", async (req, res) => {
  console.log("get to signup");
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).send("please provide all the field");
  }

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(401).json("user already exist");
    } else {
      const newUser = new User({
        name,
        email,
        password,
      });
      await newUser.save();
      res.status(201).json("register successfully");
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET route to fetch all users
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("please provide all the field");
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(402).json("user not found");
    } else if (user.password !== password) {
      return res.status(401).json("wrong password");
    } else if (user.password === password) {
      res.status(201).json("login successfully");
    } else {
      res.json("something went wrong");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
