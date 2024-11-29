
const express = require("express");
const router = express.Router();
const User = require("../Schema/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = "mynameisbiswaiamfromboindaangulodisha";
const authenticateUser = require("../authenticate");



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
  
  
  router.get('/users', async (req, res) => {
    try {
      const users = await User.find().sort({ createdAt: -1 }); // Default sorting by newest first
      res.status(200).json({ users });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });
  
  // Route to delete a user by ID
  router.delete('/deleteUser/:id', async (req, res) => {
    const { id } = req.params;
  
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
  
    try {
      const deletedUser = await User.findByIdAndDelete(id);
  
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error.message);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  });
  
  
  module.exports = router