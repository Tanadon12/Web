const express = require("express");
// const cors = require('cors');
const path = require("path");


const app = express();

const router = express.Router();

app.use("/", router);

// app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // Static files directory

app.use("/style", express.static(path.join(__dirname, "style")));
app.use("/Material", express.static(path.join(__dirname, "Material")));
app.use("/script", express.static(path.join(__dirname, "script")));



// console.log(path.join(__dirname, "style"));
router.get("/", (req, res) => {
  console.log("Request at /");
  res.status(200);
  res.sendFile(path.join(__dirname, "html", "Homepage.html"));
});



router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/SearchRes/:name", (req, res) => {
  console.log("Request at /SearchRes");
  res.status(200);
  res.sendFile(path.join(__dirname, "html", "SearchRes.html"));
});

router.get("/Homepage", (req, res) => {
  console.log("Request at /Homepage");
  res.status(200);
  res.sendFile(path.join(__dirname, "html", "Homepage.html"));
});

router.get("/Perfume/:gender", (req, res) => {
  console.log("Perfume/:gender");
  res.status(200);
  res.sendFile(path.join(__dirname, "html", "Perfume.html"));
});

router.get("/AdvanceSearch", (req, res) => {
  console.log("Request at /AdvanceSearch");
  res.status(200);
  res.sendFile(path.join(__dirname, "html", "AdvanceSearch.html"));
});

router.get("/MyAccount", (req, res) => {
  console.log("Request at /Myaccount");
  res.status(200);
  res.sendFile(path.join(__dirname, "html", "MyAccount.html"));
});

router.get("/AboutUs", (req, res) => {
  console.log("Request at /AboutUs");
  res.status(200);
  res.sendFile(path.join(__dirname, "html", "AboutUs.html"));
});

router.get("/Brand", (req, res) => {
  console.log("Request at /AboutUs");
  res.status(200);
  res.sendFile(path.join(__dirname, "html", "Brand.html"));
});

router.get("/SignIn", (req, res) => {
  console.log("Request at /SignIn");
  res.status(200);
  res.sendFile(path.join(__dirname, "html", "SignIn.html"));
});


router.get("/product-page/:id",  (req, res) => {
  console.log("Request at /product-page ");
  res.status(200);
  res.sendFile(path.join(__dirname, "html", "ProductPage.html"));
});

router.get("/Admin", (req, res) => {
  console.log("Request at /Admin");
  res.status(200);
  res.sendFile(path.join(__dirname, "html", "Admin.html"));
});

router.get("/AccountMM", (req, res) => {
  console.log("Request at /AccountMM");
  res.status(200);
  res.sendFile(path.join(__dirname, "html", "AccountMM.html"));
});

router.get("/ProductMM", (req, res) => {
  console.log("Request at /ProductMM");
  res.status(200);
  res.sendFile(path.join(__dirname, "html", "ProductMM.html"));
});

const FRONT_END_PORT = 3000; // Use environment variable or default to 3000
app.listen(process.env.FRONT_END_PORT || FRONT_END_PORT, () => {
  console.log(`Front-end server listening on port: ${FRONT_END_PORT}`);
});