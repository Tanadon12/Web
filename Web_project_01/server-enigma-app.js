
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const mysql = require("mysql2");

const app = express();
dotenv.config();

app.use(express.static('style'));

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

const router = express.Router();

app.use("/", router);

router.get("/", (req, res) => {
  console.log("Request at /");
  res.status(200);
  res.sendFile(path.join(__dirname, "html", "Homepage.html"));
});

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// router.use((req, res, next) => {
//   console.log("404: Invalid accessed");
//   res.status(404);
//   res.sendFile(path.join(__dirname, "html", "error.html"));
// });

connection.connect((err) => {
  if (err) {
    throw err;
  }

  console.log(`Connected DB: ${process.env.MYSQL_DATABASE}`);
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port: ${process.env.PORT}`);
});
