const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const mysql = require("mysql2");

const app = express();
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

const router = express.Router();

app.use("/", router);

app.use("/style", express.static(path.join(__dirname, "style")));
app.use("/Material", express.static(path.join(__dirname, "Material")));
app.use("/script", express.static(path.join(__dirname, "script")));

console.log(path.join(__dirname, "style"));
router.get("/", (req, res) => {
  console.log("Request at /");
  res.status(200);
  res.sendFile(path.join(__dirname, "html", "Homepage.html"));
});

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/Homepage.html", (req, res) => {
  console.log("Request at /Homepage");
  res.status(200);
  res.sendFile(path.join(__dirname, "html", "Homepage.html"));
});

router.get("/AdvanceSearch.html", (req, res) => {
  console.log("Request at /Homepage");
  res.status(200);
  res.sendFile(path.join(__dirname, "html", "AdvanceSearch.html"));
});

router.get("/MyAccount.html", (req, res) => {
  console.log("Request at /Homepage");
  res.status(200);
  res.sendFile(path.join(__dirname, "html", "MyAccount.html"));
});

router.get("/AboutUs.html", (req, res) => {
  console.log("Request at /Homepage");
  res.status(200);
  res.sendFile(path.join(__dirname, "html", "AboutUs.html"));
});

router.get("/SignIn.html", (req, res) => {
  console.log("Request at /Homepage");
  res.status(200);
  res.sendFile(path.join(__dirname, "html", "SignIn.html"));
});

router.get("/random-products", (req, res) => {
  console.log("applied random-product");
  const query = `
      SELECT p.Product_ID, p.Product_Name, p.Product_Type, p.Product_Brand, p.Product_Gender, p.Product_image, MIN(pa.Product_Price) AS Product_Price
      FROM Products AS p
      JOIN Product_Attributes AS pa ON p.Product_ID = pa.Product_ID
      GROUP BY p.Product_ID
      ORDER BY RAND()
      LIMIT 4
  `;
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.json(results); // Send back an array of random product data
  });
});

connection.connect((err) => {
  if (err) {
    throw err;
  }

  console.log(`Connected DB: ${process.env.MYSQL_DATABASE}`);
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port: ${process.env.PORT}`);
});
