const express = require("express");
const userRoutes = require("./routes/userRoutes");
const fileRoutes = require("./routes/fileRoutes");
const fileUpload = require("express-fileupload");
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(fileUpload());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', true);
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Authorization, authorization, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});
app.use("/auth", userRoutes);
app.use("/file", fileRoutes);

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on port ${process.env.PORT}`)
);
