const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const mysql = require("mysql2");
const TokenManager = require("./token_manager");
const cors = require("cors");

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



router.put("/editproduct/:id", async function(req, res) {
  const prodId = parseInt(req.params.id);
  console.log(req.body);
  if (!prodId) {
    return res.status(400).send({ error: true, message: "Error: product ID is not found" });
  }

  const { productName, productDescription, productIngredient, productSize, productPrice,productBrand, productType,productImage } = req.body;
  
  if (!productName || !productDescription || !productIngredient || !productSize || !productPrice || !productBrand|| !productType || !productImage) {
    return res.status(400).send({ error: true, message: "Error: All fields must be filled" });
  }

  // const authClient = await authorize();

  try {
    // Update product details
    await updateProductDetails(productName,  productType,productIngredient,productDescription,productBrand,productImage, prodId); 

    
    // Update product price
    await updateProductPrice(prodId, productSize, productPrice);

    res.send({ error: false, message: "Product and price updated successfully" });
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
});


async function updateProductDetails(productName,  productType,productIngredient,productDescription,productBrand,productImage, prodId) {
  return new Promise((resolve, reject) => {
      const updateProductQuery = `
      UPDATE products SET 
           Product_Name = ?, 
           Product_Type = ?,
           Product_Ingredients = ?, 
           Product_Description = ?, 
           Product_Brand = ?,
           Product_image = ?
          WHERE Product_ID = ?
      `;

      connection.query(updateProductQuery, [productName,  productType,productIngredient,productDescription,productBrand,productImage, prodId], function(error, results) {
          if (error) {
              reject(new Error("Error updating product details: " + error.message));
          } else {
              resolve();
          }
      });
  });
}   



async function updateProductPrice(prodId, productSize, productPrice) {
  return new Promise((resolve, reject) => {
      const updatePriceQuery = `
          UPDATE Product_Attributes SET 
              Product_Price = ?
          WHERE Product_ID = ? AND Product_Size = ?
      `;

      connection.query(updatePriceQuery, [productPrice, prodId, productSize], function(error, results) {
          if (error) {
              reject(new Error("Error updating product price: " + error.message));
          } else {
              if (results.affectedRows === 0) {
                  reject(new Error("No product attribute found with that ID and size"));
              } else {
                  resolve();
              }
          }
      });
  });
}



router.get("/Account", (req, res) => {
  const sqlQuery = `
          SELECT a.Account_ID, a.First_Name, a.Last_Name, a.Email, a.Address, l.Username, l.Password ,l.Acc_Role
          FROM Admin a 
          JOIN Login_Information l ON a.Account_ID = l.Account_ID`;

  connection.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("Failed to retrieve accounts:", err);
      return res.status(500).send({
        error: true,
        message: "Failed to retrieve accounts due to database error",
        details: err.message,
      });
    }

    res.json(results);
  });
});

router.post("/submit_login", (req, res) => {
  const { username, password } = req.body;
  const sqlQuery = `
    SELECT * FROM Login_Information WHERE Username = ? AND Password = ?`;

  connection.query(sqlQuery, [username, password], (err, results) => {
    if (err) {
      console.error("Failed to retrieve accounts:", err);
      return res.status(500).send({
        error: true,
        message: "Failed to retrieve accounts due to database error",
        details: err.message,
      });
    }
    if(results.length == 0 ){
      return res.status(401).send(JSON.stringify({status:"0"}));
    } 
    let accessToken = TokenManager.getGenerateAccessToken({username});
    console.log(results);
    res.send(JSON.stringify({status:"1","access_token":accessToken}));
  });
});

router.post("/check_authen",(req,res)=>{
  let jwtStatus = TokenManager.checkAuthentication(req);
  if(jwtStatus!=false){
      res.send(jwtStatus);
  }else{
      res.send(false);
  }
});


router.get("/getAccount/:accountId", (req, res) => {
  const accountId = parseInt(req.params.accountId);

  if (!accountId) {
    return res.status(400).send({
      error: true,
      message: "Invalid account ID",
    });
  }

  const sqlQuery = `
          SELECT a.Account_ID, a.First_Name, a.Last_Name, a.Email, a.Address, l.Username, l.Password ,l.Acc_Role
          FROM Admin a 
          JOIN Login_Information l ON a.Account_ID = l.Account_ID
          WHERE a.Account_ID = ?`;

  connection.query(sqlQuery, [accountId], (err, results) => {
    if (err) {
      console.error("Failed to retrieve account:", err);
      return res.status(500).send({
        error: true,
        message: "Failed to retrieve account due to database error",
        details: err.message,
      });
    }

    if (results.length > 0) {
      res.json(results[0]); // Send back the first result since Account_ID should be unique
    } else {
      res.status(404).send({
        error: true,
        message: "Account not found",
      });
    }
  });
});

router.get("/random-products", (req, res) => {
  console.log("applied random-product");
  let gender = req.query.gender; // Capture the 'gender' parameter from the query string
  console.log(gender);

  // Start building the SQL query
  let query = `
    SELECT p.Product_ID, p.Product_Name, p.Product_Type, p.Product_Brand, p.Product_Gender, p.Product_image, MIN(pa.Product_Price) AS Product_Price
    FROM Products AS p
    JOIN Product_Attributes AS pa ON p.Product_ID = pa.Product_ID
  `;

  // If a gender was provided and is valid, add a WHERE clause to filter by gender
  if (gender && ["Men", "Woman"].includes(gender)) {
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

router.get("/Perfume/:gender?", (req, res) => {
  const { gender } = req.params;
  if (!gender) {
    gender = "Unisex"; // Default to Unisex if no gender specified
  }

  const limit = parseInt(req.query.limit, 10) || 36;
  const page = parseInt(req.query.page, 10) || 1;
  const offset = (page - 1) * limit;
  const sort = req.query.sort || "name";

  let orderByClause;
  switch (sort) {
    case "name":
      orderByClause = "ORDER BY p.Product_Name";
      break;
    case "price-asc":
      orderByClause = "ORDER BY MIN(pa.Product_Price) ASC";
      break;
    case "price-desc":
      orderByClause = "ORDER BY MIN(pa.Product_Price) DESC";
      break;
    default:
      orderByClause = "ORDER BY p.Product_Name";
      break;
  }

  let genderFilter;
  let queryParams;
  if (gender === "Men" || gender === "Woman") {
    genderFilter = `p.Product_Gender IN (?, 'Unisex')`;
    queryParams = [gender, offset, limit]; // Correct order of parameters
  } else {
    genderFilter = `p.Product_Gender IN ('Men', 'Woman', 'Unisex')`;
    queryParams = [offset, limit]; // Gender is not included
  }
  console.log("Gender:", gender);
  console.log("Gender Filter:", genderFilter);
  console.log("Query Parameters:", queryParams);

  const countQuery = `
    SELECT COUNT(DISTINCT p.Product_ID) AS total
    FROM Products AS p
    WHERE ${genderFilter}
  `;

  const productQuery = `
    SELECT p.Product_ID, p.Product_Name, p.Product_Type, p.Product_Brand, p.Product_Gender, p.Product_image, MIN(pa.Product_Price) AS Product_Price
    FROM Products AS p
    JOIN Product_Attributes AS pa ON p.Product_ID = pa.Product_ID
    WHERE ${genderFilter}
    GROUP BY p.Product_ID
    ${orderByClause}
    LIMIT ?, ?
  `;

  // Execute count query
  connection.query(countQuery, queryParams, (err, countResults) => {
    if (err) {
      console.error("Error executing count query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const totalProducts = countResults[0].total;

    // Execute product query
    connection.query(productQuery, queryParams, (err, products) => {
      if (err) {
        console.error("Error executing product query:", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.json({ products, totalProducts });
    });
  });
});

 router.get("/searchByName/:name", (req, res) => {
    const productName = req.params.name;
    console.log("Search applied for: " + productName);
    const query = `
      SELECT 
        p.Product_ID, p.Product_Name, p.Product_Type, p.Product_Brand,
        p.Product_Gender, p.Product_image, p.Product_Ingredients, p.Product_Description,
        MIN(pa.Product_Price) AS Min_Product_Price
      FROM Products AS p
      JOIN Product_Attributes pa ON p.Product_ID = pa.Product_ID
      WHERE p.Product_Name LIKE ?
      GROUP BY p.Product_ID
    `;
    const searchName = `%${productName}%`; // Adding '%' to search for names containing the input name

    connection.query(query, [searchName], (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json({ products: results });
    });
});

router.get("/product-details/:id", (req, res) => {
  // Extract the product ID from the request parameters
  const productId = req.params.id;
  console.log("request " + productId);

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
      console.error("Error fetching product details:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (results.length === 0) {
      res.status(404).send("Product not found");
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
        Product_Description: results[0].Product_Description,
      },
      attributes: results.map((row) => ({
        Product_SKU: row.Product_SKU,
        Product_Size: row.Product_Size,
        Product_Price: row.Product_Price,
      })),
    };

    // Send back the formatted product details
    res.json(productDetails);
  });
});

router.get("/product-search-options", (req, res) => {
  // Queries to fetch unique options for each dropdown
  const queries = {
    brands:
      "SELECT DISTINCT Product_Brand FROM Products WHERE Product_Brand IS NOT NULL ORDER BY Product_Brand",
    types:
      "SELECT DISTINCT Product_Type FROM Products WHERE Product_Type IS NOT NULL ORDER BY Product_Type",
    genders:
      "SELECT DISTINCT Product_Gender FROM Products WHERE Product_Gender IS NOT NULL ORDER BY Product_Gender",
    sizes:
      "SELECT DISTINCT Product_Size FROM Product_Attributes WHERE Product_Size IS NOT NULL ORDER BY Product_Size",
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
          searchOptions[key] = results.map(
            (result) => result[Object.keys(result)[0]]
          );
          resolve();
        }
      });
    });
  };

  // Execute all queries in parallel and return the combined result
  Promise.all([
    fetchOptions("brands"),
    fetchOptions("types"),
    fetchOptions("genders"),
    fetchOptions("sizes"),
  ])
    .then(() => res.json(searchOptions))
    .catch((err) => {
      console.error("Error fetching search options:", err);
      res.status(500).send("Internal Server Error");
    });
});

router.post("/searchRes", (req, res) => {
  const { name, type, brand, gender } = req.body;
  let { size } = req.body; // Could be a comma-separated string or a single value

  // Correctly reference the hyphenated property names
  let minPriceInput = parseFloat(req.body["min-price"]);
  let maxPriceInput = parseFloat(req.body["max-price"]);

  // Log the parsed prices to verify correctness
  console.log("Parsed Prices:", minPriceInput, maxPriceInput);

  if (isNaN(minPriceInput) || isNaN(maxPriceInput)) {
    console.error(
      "Invalid minPrice or maxPrice input:",
      req.body["min-price"],
      req.body["max-price"]
    );
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
    size =
      typeof size === "string" ? size.split(",").map((s) => s.trim()) : [size];
    conditions.push(`pa.Product_Size IN (${size.map(() => "?").join(",")})`);
    params.push(...size);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
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

router.delete("/deleteAccount/:id", (req, res) => {
  const accountID = req.params.id;
  const query = "DELETE FROM Admin WHERE Account_ID = ?";

  connection.query(query, [accountID], (err, result) => {
      if (err) {
          console.error("Failed to delete account:", err);
          res.status(500).send({ error: "Failed to delete account", details: err.message });
      } else {
          res.send({ message: "Account deleted successfully" });
      }
  });
});


// deleting product
router.delete("/delete/:id", (req, res) => {
  const productId = req.params.id;
  const query = "DELETE FROM Products WHERE Product_ID = ?";

  connection.query(query, [productId], (err, result) => {
    if (err) {
      console.error("Failed to delete product:", err);
      res.status(500).send({ error: "Failed to delete product" });
    } else {
      console.log("Product deleted successfully:", result);
      res.send({ message: "Product deleted successfully" });
    }
  });
});

router.put("/editAccount/:id", async (req, res) => {
  const accountId = req.params.id;
  const {
    firstName,
    lastName,
    email,
    address,
    username,
    password
  } = req.body;

  // Validation to ensure all fields are provided
  if (!firstName || !lastName || !email || !address || !username || !password) {
    return res.status(400).send({ error: true, message: "All fields are required." });
  }

  try {
    // Update Admin information
    const adminUpdateQuery = `
      UPDATE Admin SET
      First_Name = ?,
      Last_Name = ?,
      Email = ?,
      Address = ?
      WHERE Account_ID = ?;
    `;
    await connection.promise().query(adminUpdateQuery, [firstName, lastName, email, address, accountId]);

    // Update Login Information
    const loginUpdateQuery = `
      UPDATE Login_Information SET
      Username = ?,
      Password = ?
      WHERE Account_ID = ?;
    `;
    await connection.promise().query(loginUpdateQuery, [username, password, accountId]);

    res.send({ error: false, message: "Account updated successfully." });
  } catch (error) {
    console.error("Failed to update account:", error);
    res.status(500).send({
      error: true,
      message: "Failed to update account due to database error",
      details: error.message
    });
  }
});



router.post("/insert_account",  async (req, res) => {
  const { firstName, lastName, email, address, username, password,addRole} = req.body;
  console.log(req.body);

      // Insert into Admin table
      
      const adminInsertQuery = `
          INSERT INTO Admin (First_Name, Last_Name, Email, Address)
          VALUES (?, ?, ?, ?);
      `;
      const adminResults = await connection.promise().query(adminInsertQuery, [firstName, lastName, email, address]);
      const adminId = adminResults[0].insertId; // Get the newly created Admin ID

      // Insert into Login_Information table
      const loginInsertQuery = `
          INSERT INTO Login_Information (Username, Password, Account_ID, Acc_Role)
          VALUES (?, ?, ?, ?);
      `;
      await connection.promise().query(loginInsertQuery, [username, password, adminId, addRole]);

      res.send({
          error: false,
          message: "Account created successfully."
      });
 

});

router.post("/insert_product", async function (req, res) {
  console.log(req.body); // Check the parsed body to debug  

  const {
      productName,
      productDescription,
      productPrice,
      productIngredient,
      productSize,
      productGender,
      productImage,
      productBrand,    // Added variable for product brand
      productType      // Added variable for product type
  } = req.body;



  // SQL query to insert a new product into the database
  const query = `INSERT INTO Products (Product_Name, Product_Description, Product_Brand, Product_Gender, Product_image, Product_Ingredients, Product_Type)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

  // Use all fields, including the new ones
  connection.query(query, [productName, productDescription, productBrand, productGender, productImage, productIngredient, productType], (err, result) => {
      if (err) {
          console.error("Failed to insert new product:", err);
          return res.status(500).send({
              error: true,
              message: "Failed to insert new product due to database error",
              details: err.message
          });
      }

      // If the insert was successful, proceed to insert product attributes
      const newProductId = result.insertId;
      insertProductAttributes(newProductId, productSize, productPrice, (err, attrResult) => {
          if (err) {
              console.error("Failed to insert product attributes:", err);
              return res.status(500).send({
                  error: true,
                  message: "Product created but failed to insert product attributes",
                  details: err.message
              });
          }

          // If everything was successful
          res.send({
      
              error: false,
              data: result.affectedRows,
              message: "New product has been created successfully."
          });
      });
  });
});

function insertProductAttributes(productId, size, price, callback) {
  const attributesQuery = `INSERT INTO Product_Attributes (Product_ID, Product_Size, Product_Price) VALUES (?, ?, ?)`;
  connection.query(attributesQuery, [productId, size, price], (err, result) => {
      callback(err, result);
  });
}


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
