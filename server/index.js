const express = require("express");
const app = express();

const connectDb = require("./db.js");
const router = require("./route");
const cors = require("cors");

const coreOptions = {
  origin: ["https://xnyrw2-5173.csb.app"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",

  credentials: true,
};
app.use(cors(coreOptions));

connectDb();
app.use(express.json());
app.use(router);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
