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

router.get("/random-products", (req, res) => {
  console.log("applied random-product");
  let gender = req.query.gender; // Capture the 'gender' parameter from the query string
  console.log(gender)

  // Start building the SQL query
  let query = `
    SELECT p.Product_ID, p.Product_Name, p.Product_Type, p.Product_Brand, p.Product_Gender, p.Product_image, MIN(pa.Product_Price) AS Product_Price
    FROM Products AS p
    JOIN Product_Attributes AS pa ON p.Product_ID = pa.Product_ID
  `;

  // If a gender was provided and is valid, add a WHERE clause to filter by gender
  if (gender && ['Men', 'Woman'].includes(gender)) {
    query += ` WHERE p.Product_Gender = '${gender}'`;
  }

  // Continue with GROUP BY and ORDER BY clauses
  query += `
    GROUP BY p.Product_ID
    ORDER BY RAND()
    LIMIT 4
  `;

  // Execute the query
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.json(results); // Send back an array of random product data
  });
});



router.get("/Perfume/:gender", (req, res) => {
  const gender = req.params.gender; // Capture the 'gender' parameter from the URL path
  console.log("fetch all product Unisex + " + gender)
  let query = `
    SELECT p.Product_ID, p.Product_Name, p.Product_Type, p.Product_Brand, p.Product_Gender, p.Product_image, MIN(pa.Product_Price) AS Product_Price
    FROM Products AS p
    JOIN Product_Attributes AS pa ON p.Product_ID = pa.Product_ID
    WHERE p.Product_Gender IN ('${gender}', 'Unisex')
    GROUP BY p.Product_ID
    ORDER BY p.Product_Name
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results); // Send back an array of product data
    }
  });
});

router.get("/product-details/:id", (req, res) => {
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

router.get("/product-search-options", (req, res) => {
  // Queries to fetch unique options for each dropdown
  const queries = {
    brands: "SELECT DISTINCT Product_Brand FROM Products WHERE Product_Brand IS NOT NULL ORDER BY Product_Brand",
    types: "SELECT DISTINCT Product_Type FROM Products WHERE Product_Type IS NOT NULL ORDER BY Product_Type",
    genders: "SELECT DISTINCT Product_Gender FROM Products WHERE Product_Gender IS NOT NULL ORDER BY Product_Gender",
    sizes: "SELECT DISTINCT Product_Size FROM Product_Attributes WHERE Product_Size IS NOT NULL ORDER BY Product_Size",
  };

  // Object to hold the final results
  const searchOptions = {};

  // Helper function to perform query and collect results
  const fetchOptions = (key) => {
    return new Promise((resolve, reject) => {
      connection.query(queries[key], (err, results) => {
        if (err) {
          console.error(`Error fetching ${key}:`, err);
          reject(err);
        } else {
          // Map results based on the key, ensuring only non-null values are considered
          searchOptions[key] = results.map(result => result[Object.keys(result)[0]]);
          resolve();
        }
      });
    });
  };

  // Execute all queries in parallel and return the combined result
  Promise.all([
    fetchOptions('brands'),
    fetchOptions('types'),
    fetchOptions('genders'),
    fetchOptions('sizes'),
  ])
  .then(() => res.json(searchOptions))
  .catch(err => {
    console.error('Error fetching search options:', err);
    res.status(500).send('Internal Server Error');
  });
});

router.post("/searchRes", (req, res) => {
  const { name, type, brand, gender } = req.body;
  let { size } = req.body; // Could be a comma-separated string or a single value

  // Correctly reference the hyphenated property names
  let minPriceInput = parseFloat(req.body['min-price']);
  let maxPriceInput = parseFloat(req.body['max-price']);

  // Log the parsed prices to verify correctness
  console.log("Parsed Prices:", minPriceInput, maxPriceInput);

  if (isNaN(minPriceInput) || isNaN(maxPriceInput)) {
    console.error('Invalid minPrice or maxPrice input:', req.body['min-price'], req.body['max-price']);
    res.status(400).send("Invalid price inputs");
    return;
  }

  let query = `
    SELECT 
      p.Product_ID, p.Product_Name, p.Product_Type, p.Product_Brand,
      p.Product_Gender, p.Product_image, p.Product_Ingredients, p.Product_Description,
      GROUP_CONCAT(DISTINCT pa.Product_Size ORDER BY pa.Product_Size) AS Product_Sizes,
      MIN(pa.Product_Price) AS Min_Product_Price,
      MAX(pa.Product_Price) AS Max_Product_Price
    FROM Products p
    JOIN Product_Attributes pa ON p.Product_ID = pa.Product_ID
  `;

  const conditions = [];
  const params = [];

  if (name) {
    conditions.push("p.Product_Name LIKE ?");
    params.push(`%${name}%`);
  }
  if (type) {
    conditions.push("p.Product_Type = ?");
    params.push(type);
  }
  if (brand) {
    conditions.push("p.Product_Brand = ?");
    params.push(brand);
  }
  if (gender) {
    conditions.push("p.Product_Gender = ?");
    params.push(gender);
  }
  if (size) {
    size = typeof size === 'string' ? size.split(',').map(s => s.trim()) : [size];
    conditions.push(`pa.Product_Size IN (${size.map(() => '?').join(',')})`);
    params.push(...size);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  query += ` GROUP BY p.Product_ID`;

  // Add HAVING clause to filter by min and max price
  query += ` HAVING MIN(pa.Product_Price) >= ? AND MAX(pa.Product_Price) <= ?`;
  params.push(minPriceInput, maxPriceInput);

  connection.query(query, params, (err, results) => {
    if (err) {
      console.error("Error executing query: ", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    if (results.length === 0) {
      // Explicitly return an empty array if no products are found
      res.json([]);
    } else {
      res.json(results);
    }
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
