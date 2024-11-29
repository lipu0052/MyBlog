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




module.exports = router;
