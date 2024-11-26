const express = require("express");
const cors = require('cors');
const path = require("path");
const axios = require('axios');
const multer = require('multer');
const upload = multer();
const formdata  = require("form-data");

const app = express();

const router = express.Router();

app.use("/", router);

app.use(cors());
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


router.get("/proxy/Perfume/:gender", async (req, res) => {
  const { gender } = req.params;
  const { limit, page, sort } = req.query;
  
  try {
    const backendResponse = await axios.get(`http://localhost:8000/Perfume/${gender}?limit=${limit}&page=${page}&sort=${sort}`);
    res.json(backendResponse.data);
  } catch (error) {
    console.error("Error fetching perfumes:", error.response || error.message);
    res.status(error.response?.status || 500).send(error.response?.data || "Internal Server Error");
  }
});

router.get("/proxy/product-details/:productId", async (req, res) => {
  const { productId } = req.params;
  try {
    // Forward the request to the backend service
    const backendResponse = await axios.get(`http://localhost:8000/product-details/${productId}`);
    // Send the response back to the frontend
    res.json(backendResponse.data);
  } catch (error) {
    // Handle errors
    console.error("Error fetching product details from backend:", error);
    res.status(500).send("Internal Server Error");
  }
});


router.get("/proxy/searchByName/:name", async (req, res) => {
  const { name } = req.params;
  try {
    // Forward the request to the backend service
    const backendResponse = await axios.get(`http://localhost:8000/searchByName/${encodeURIComponent(name)}`);
    // Send the response back to the frontend
    res.json(backendResponse.data);
  } catch (error) {
    // Handle errors
    console.error("Error searching for products in backend:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/proxy/submit_login", async (req,  res) => {
  try {
    // Forward the login request to the backend service
    const backendResponse = await axios.post('http://localhost:8000/submit_login', req.body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Send the response back to the frontend, including headers if necessary
    res.json(backendResponse.data);
  } catch (error) {
    // Handle errors
    console.error("Error during login:", error.response || error.message);
    res.status(error.response?.status || 500).send(error.response?.data || "Internal Server Error");
  }
});

router.get("/proxy/random-products", async (req, res) => {
  try {
    // Forward the request to the backend service
    const backendResponse = await axios.get(`http://localhost:8000/random-products`);
    // Send the response back to the frontend
    res.json(backendResponse.data);
  } catch (error) {
    // Handle errors
    console.error("Error fetching random products:", error.response || error.message);
    res.status(error.response?.status || 500).send(error.response?.data || "Internal Server Error");
  }
});


// Proxy endpoint for fetching product search options
router.get("/proxy/product-search-options", async (req, res) => {
  try {
    // Forward the request to the backend service
    const backendResponse = await axios.get(`http://localhost:8000/product-search-options`);
    // Send the response back to the frontend
    res.json(backendResponse.data);
  } catch (error) {
    // Handle errors
    console.error("Error fetching product search options:", error.response || error.message);
    res.status(error.response?.status || 500).send(error.response?.data || "Internal Server Error");
  }
});

// Proxy endpoint for search results
router.post("/proxy/searchRes", async (req, res) => {
  try {
    // Forward the search request to the backend service
    const backendResponse = await axios.post(`http://localhost:8000/searchRes`, req.body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    // Send the response back to the frontend
    res.json(backendResponse.data);
  } catch (error) {
    // Handle errors
    console.error("Error fetching search results:", error.response || error.message);
    res.status(error.response?.status || 500).send(error.response?.data || "Internal Server Error");
  }
});

// Proxy endpoint for authentication check
router.post("/proxy/check_authen", async (req, res) => {
  // Forward the POST request to the backend service
  try {
    const backendResponse = await axios.post('http://localhost:8000/check_authen', {}, {
      headers: {
        'Authorization': req.headers['authorization'] // Forward the Authorization header
      }
    });
    res.json(backendResponse.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Proxy endpoint for editing products
router.put("/proxy/editproduct/:id", upload.none(), async (req, res) => {
  const { id } = req.params;
  try {
    const backendResponse = await axios.put(`http://localhost:8000/editproduct/${id}`, req.body, {
      headers: {
        "Content-Type": "application/json"
    }
    });
    res.json(backendResponse.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Proxy endpoint for inserting new products
router.post("/proxy/insert_product", upload.none(), async (req, res) => {
  // Forward the POST request to the backend service
  console.log(req.body);
  try {
    const backendResponse = await axios.post('http://localhost:8000/insert_product', req.body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    res.json(backendResponse.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Proxy endpoint for fetching accounts
router.get("/proxy/account", async (req, res) => {
  try {
    const backendResponse = await axios.get(`http://localhost:8000/Account`);
    res.json(backendResponse.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Proxy endpoint for fetching a single account details
router.get("/proxy/getAccount/:accountId", async (req, res) => {
  try {
    const backendResponse = await axios.get(`http://localhost:8000/getAccount/${req.params.accountId}`);
    res.json(backendResponse.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Proxy endpoint for inserting a new account
router.post("/proxy/insert_account", upload.none(), async (req, res) => {
  try {
    const backendResponse = await axios.post(`http://localhost:8000/insert_account`, req.body, {
      headers: { 'Content-Type': 'application/json' }
      
    });
    res.json(backendResponse.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Proxy endpoint for updating an account
router.put("/proxy/editAccount/:accountId", upload.none(), async (req, res) => {
  try {
    const backendResponse = await axios.put(`http://localhost:8000/editAccount/${req.params.accountId}`, req.body, {
      headers: { 'Content-Type': 'application/json' }
    });
    res.json(backendResponse.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Proxy endpoint for deleting an account
router.delete("/proxy/deleteAccount/:accountId", async (req, res) => {
  try {
    const backendResponse = await axios.delete(`http://localhost:8000/deleteAccount/${req.params.accountId}`);
    res.json(backendResponse.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/proxy/deleteProduct/:productId", async (req, res) => {
  try {
    const backendResponse = await axios.delete(`http://localhost:8000/delete/${req.params.productId}`);
    res.json(backendResponse.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



const FRONT_END_PORT = 8080; // Use environment variable or default to 3000
app.listen(process.env.FRONT_END_PORT || FRONT_END_PORT, "0.0.0.0" , () => {
  console.log(`Front-end server listening on port: ${FRONT_END_PORT}`);
});