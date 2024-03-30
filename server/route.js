const express = require("express");
const User = require("./schema"); // Assuming the schema/model file is named model.js

const router = express.Router();

// POST route to create a new user
router.get("/", (req, res) => {
  res.send("hello world");
});
router.post("/users", async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET route to fetch all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
