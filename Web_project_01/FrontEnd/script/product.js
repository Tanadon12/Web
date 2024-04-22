// product.js
const backendBaseUrl = 'http://localhost:8000';


document.addEventListener('DOMContentLoaded', function() {
    const productId = window.location.pathname.split('/').pop();
    fetchProductDetails(productId);
  }); 
  
  function fetchProductDetails(productId) {
    
    fetch(`http://localhost:8000/product-details/${productId}`)
    
      .then((response) => response.json())
      .then((productDetails) => {
        const { product, attributes } = productDetails;
        console.log("open product ID" + productId);
        // Populate the page with product info
        document.getElementById("productName").textContent = product.Product_Name;
        document.getElementById("productBrand").textContent = 'Brand: ' + product.Product_Brand;
        document.getElementById("productDescription").textContent = 'Description: ' + product.Product_Description;
        document.getElementById("productIngredient").textContent = 'Ingredients: ' + product.Product_Ingredients;
        document.getElementById("productType").textContent = 'Type: ' + product.Product_Type;
        document.getElementById("productGender").textContent = 'Gender: ' + product.Product_Gender;
        document.getElementById("productLink").textContent = 'Link: ' + product.Product_image;
        const imageUrl = `https://drive.google.com/thumbnail?id=${extractGoogleDriveId(product.Product_image)}`;
        document.getElementById("productImage").src = imageUrl;
        
        // Display sizes and prices
        let sizeOptions = attributes.map(attr => `<option value="${attr.Product_Size}" data-price="${attr.Product_Price}">${attr.Product_Size} ml</option>`).join('');
        let sizeSelect = document.createElement('select');
        sizeSelect.innerHTML = sizeOptions;
        let productSizeContainer = document.getElementById("productSize");
        productSizeContainer.textContent = 'Size: '; // Clear existing content
        productSizeContainer.appendChild(sizeSelect);
        
        // Set and update the price
        let productPrice = document.getElementById("productPrice");
        productPrice.textContent = 'Price: $' + attributes[0].Product_Price;
        sizeSelect.addEventListener('change', () => {
          let selectedPrice = sizeSelect.options[sizeSelect.selectedIndex].getAttribute('data-price');
          productPrice.textContent = 'Price: $' + selectedPrice;
        });
      })
      .catch((error) => console.error("Error fetching product details:", error));
  }
  
  function extractGoogleDriveId(url) {
    const fileIdMatch = url.match(/file\/d\/(.*?)\//);
    return fileIdMatch ? fileIdMatch[1] : null;
  }
  