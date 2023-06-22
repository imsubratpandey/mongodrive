const express = require("express");
const app = express();
require("dotenv").config();

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on port ${process.env.PORT}`)
);