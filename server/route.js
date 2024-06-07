const express = require("express");
const mongoose = require("mongoose");
const User = require("./userSchema");
const Post = require('./postSchema');
const bodyParser = require("body-parser");
const router = express.Router();
router.use(bodyParser.json());
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const jwtSecret = "mynameisbiswaiamfromboindaangulodisha";

// POST route to create a new user
router.get("/", (req, res) => {
  res.send("hello world  from backend");
});
const authenticateUser = async (req, res, next) => {

  try {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json({ message: "Invalid token " });
    }
    else {
      const user = jwt.verify(token, jwtSecret);
      const rootUser = await User.findOne({ _id: user._id });
      if (!rootUser) {
        return res.status(401).json({ message: "User not found" });
      }

      req.rootUser = rootUser;
      next();
    }



  } catch (err) {
    return res.status(401).json({ message: "Invalid token " });
  }
};
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
        const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin }, jwtSecret);
        res.cookie("access_token", token, {
          httpOnly: true,
        });
        return res.status(200).json({ message: "Signin successfully", user });
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
      const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin }, jwtSecret);
      console.log(token);
      res.cookie("access_token", token, {
        httpOnly: true,
      });
      return res.status(200).json({ message: "Signin successfully", user })
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
      const token = jwt.sign({ _id: newUser._id, isAdmin: newUser.isAdmin }, jwtSecret);
      console.log(token);


      res.cookie("access_token", token, {
        httpOnly: true,
      });
      return res.status(200).json({ message: "Signin successfully", user })
    }
  } catch (err) {
    next(err);
  }
});
router.get("/userdata", authenticateUser, async (req, res, next) => {
  res.send(req.rootUser);
});



router.get("/logout", (req, res) => {
  res.clearCookie("access_token").status(200).json({ message: "logout successfully" });

})

// In your backend router file
router.put('/updateProfile/:userId', authenticateUser, async (req, res, next) => {
  const { name, email, password } = req.body;
  let profileImg = req.body.profileImg;
  const rootUserId = req.rootUser._id.toString();

  if (req.params.userId !== rootUserId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const updates = { name, email, profileImg };

  // Validate and handle password update if provided
  if (password) {
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    const hashPass = await bcrypt.hash(password, 10);
    updates.password = hashPass;
  }

  // Validate other fields if needed
  if (name) {
    if (name.length < 6 || name.length > 20) {
      return res.status(400).json({ message: 'Name must be between 6 and 20 characters' });
    }
    if (name.includes(' ')) {
      return res.status(400).json({ message: 'Name must not contain spaces' });
    }
    if (name !== name.toLowerCase()) {
      return res.status(400).json({ message: 'Name must be lowercase' });
    }
    if (!name.match(/^[a-zA-Z0-9]+$/)) {
      return res.status(400).json({ message: 'Name must be alphanumeric' });
    }
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: updates },
      { new: true }
    );
    res.status(200).json({ message: 'Profile updated successfully', updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
    next(error);
  }
});

router.delete('/deleteAccount/:userId', authenticateUser, async (req, res, next) => {
  try {
    const rootUserId = req.rootUser._id.toString();
    if (req.params.userId !== rootUserId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const deletedUser = await User.findOneAndDelete({ _id: req.params.userId });
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Clear the access token cookie
    res.clearCookie('access_token');
    res.status(200).json({ message: 'Account deleted successfully', deletedUser });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.post('/post', authenticateUser, async (req, res) => {
  if (!req.rootUser.isAdmin) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const { title, content, image , category } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({ message: 'Please provide all fields' });
  }

  const slug = title.split(' ').join('_').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '_');

  const newPost = new Post({
    title,
    slug,
    content,
    category,
    author: req.rootUser._id,
    image: image || 'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.webp'
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json({ message: 'Post created successfully', savedPost });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
