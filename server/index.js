const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const connectDb = require("./db.js");
const router = require("./route");
const cors = require("cors");

const coreOptions = {
  origin: ["https://5173-lipu0052-myblog-41hg32rb1tg.ws-us110.gitpod.io"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",

  credentials: true,
};
app.use(cors(coreOptions));

app.use(cookieParser());

connectDb();
app.use(express.json());
app.use(router);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
