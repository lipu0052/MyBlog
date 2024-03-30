const express = require("express");
const User = require("./schema"); // Assuming the schema/model file is named model.js

const router = express.Router();

// POST route to create a new user
router.get("/", (req, res) => {
  res.send("hello world");
});
router.post("/signup", async (req, res) => {
  const{name , email , password} = req.body;
  if(!name || !email || !password){
   return res.send("please provide all the field")
  }

  try {
    const userExist = await User.findOne({email});
    if(userExist){
     return res.status(401).json("user already exist");
    }
    else{
      const newUser = new User({
        name,
        email,
        password
      });
       await newUser.save();
      res.status(201).json("register successfully");
    }

    
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET route to fetch all users
router.get("/signin", async (req, res) => {
  try {
    const [email,password] =req.body();
    const users = await User.find(email);

    if(users){
      const passCheck = await 
    }

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
