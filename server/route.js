const express = require("express");
const User = require("./schema"); // Assuming the schema/model file is named model.js
const bodyParser = require("body-parser");
const router = express.Router();
router.use(bodyParser.json());
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const jwtSecret = "mynameisbiswaiamfromboindaangulodisha";

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
    } else {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json("Wrong password");
      } else {
        const token = jwt.sign({ _id: user._id }, jwtSecret);
        return res
          .status(200)
          .cookie("access_token", token, {
            httpOnly: true,
          })
          .json({ message: "signin sucessfully", user });
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post("/googleSignin", async (req, res, next) => {
  const { name, email, googlePhotoUrl } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ _id: user._id }, jwtSecret);
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json({ message: "signin sucessfully", user });
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashPass = await bcrypt.hash(generatePassword, 10);
      const newUser = new User({
        name:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),

        email,
        password: hashPass,
        profileImg: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign({ _id: newUser._id }, jwtSecret);

      res
        .status(201)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json({ message: "signup sucessfully", user });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
