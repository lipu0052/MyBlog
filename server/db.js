const mongoose = require("mongoose");
const url =
  "mongodb+srv://lipu:lipu23lipu@biswa.y9b2hs8.mongodb.net/blog?retryWrites=true&w=majority&appName=biswa";

const connectDb = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("connected successfully");
  } catch (err) {
    console.log("can't connect to database ");
  }
};

module.exports = connectDb;
