const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const mysql = require("mysql2");
const cors = require('cors');

const app = express();
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

const router = express.Router();

router.use(cors());

app.use("/", router);


router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get("/random-products",cors(), (req, res) => {
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

// This route serves the product page HTML
router.get("/product-page/:id",cors(), (req, res) => {
  console.log("Request for product page with ID: ", req.params.id);
  // You might need to adjust the path and file name according to your setup
  const query = `
    SELECT 
      p.Product_ID, p.Product_Name, p.Product_Type, p.Product_Brand,
      p.Product_Gender, p.Product_image, p.Product_Ingredients, p.Product_Description,
      pa.Product_SKU, pa.Product_Size, pa.Product_Price
    FROM Products AS p
    JOIN Product_Attributes AS pa ON p.Product_ID = pa.Product_ID
    WHERE p.Product_ID = ?
  `;
  res.sendFile(path.join(__dirname, "html", "ProductPage.html"));
});


router.get("/product-details/:id",cors(), (req, res) => {
  // Extract the product ID from the request parameters
  const productId = req.params.id;

  // Query to fetch product details and its attributes
  const query = `
    SELECT 
      p.Product_ID, p.Product_Name, p.Product_Type, p.Product_Brand,
      p.Product_Gender, p.Product_image, p.Product_Ingredients, p.Product_Description,
      pa.Product_SKU, pa.Product_Size, pa.Product_Price
    FROM Products AS p
    JOIN Product_Attributes AS pa ON p.Product_ID = pa.Product_ID
    WHERE p.Product_ID = ?
  `;

  // Execute the query with the product ID
  connection.query(query, [productId], (err, results) => {
    if (err) {
      console.error('Error fetching product details:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('Product not found');
      return;
    }

    // Format the results into a more usable object
    const productDetails = {
      product: {
        Product_ID: results[0].Product_ID,
        Product_Name: results[0].Product_Name,
        Product_Type: results[0].Product_Type,
        Product_Brand: results[0].Product_Brand,
        Product_Gender: results[0].Product_Gender,
        Product_image: results[0].Product_image,
        Product_Ingredients: results[0].Product_Ingredients,
        Product_Description: results[0].Product_Description
      },
      attributes: results.map(row => ({
        Product_SKU: row.Product_SKU,
        Product_Size: row.Product_Size,
        Product_Price: row.Product_Price
      }))
    };

    // Send back the formatted product details
    res.json(productDetails);
  });
});




connection.connect((err) => {
  if (err) {
    throw err;
  }

  console.log(`Connected DB: ${process.env.MYSQL_DATABASE}`);
});

const WEB_SERVICE_PORT = 8000; // Set web service server to listen on port 8000
app.listen(WEB_SERVICE_PORT, () => {
  console.log(`Web service server listening on port: ${WEB_SERVICE_PORT}`);
});
