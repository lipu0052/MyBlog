const jwt = require("jsonwebtoken");
const jwtSecret = "mynameisbiswaiamfromboindaangulodisha";
const User = require("./Schema/userSchema");



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

  module.exports = authenticateUser