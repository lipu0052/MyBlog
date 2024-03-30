const express = require("express");
const connectDb = require("./db.js");
const router = require("./route");
connectDb();
const app = express();
app.use(express.json());
app.use(router);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
