// script.js (See password Buttom)
document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("password");
  const togglePasswordButton = document.getElementById("togglePassword");

  togglePasswordButton.addEventListener("click", function () {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      togglePasswordButton.textContent = "Hide Password";
    } else {
      passwordInput.type = "password";
      togglePasswordButton.textContent = "Show Password";
    }
  });
});

function fetchProductsForContainer(containerClass) {
  fetch("/random-products")
  .then((response) => response.json())
  .then((products) => {
      const container = document.querySelector(`.randomProductContainer.${containerClass}`);
      container.innerHTML = ""; // Clear the container

      // Directly iterate over the products and append them to the container
      products.forEach((product) => {
          // Extract the Google Drive ID from the Product_image URL
          const driveUrl = product.Product_image;
          const fileIdMatch = driveUrl.match(/file\/d\/(.*?)\//);
          const fileId = fileIdMatch ? fileIdMatch[1] : null;

          // Construct the thumbnail src URL
          const imageUrl = fileId ? `https://drive.google.com/thumbnail?id=${fileId}` : "path/to/default/image.jpg";

          const htmlContent = `
              <div class="perfume">
                  <img src="${imageUrl}" alt="${product.Product_Name}" />
                  <h2>${product.Product_Name}</h2>
                  <p>By ${product.Product_Brand}</p>
                  <p class="price">Price : ${product.Product_Price} $</p>
              </div>
          `;
          container.innerHTML += htmlContent; // Append new product content
      });
  })
  .catch((error) => console.error("Error:", error));
}

document.addEventListener("DOMContentLoaded", function () {
  fetchProductsForContainer("first");
  fetchProductsForContainer("second");
});

// Utility function to extract Google Drive ID from URL
function extractGoogleDriveId(url) {
  const fileIdMatch = url.match(/file\/d\/(.*?)\//);
  return fileIdMatch ? fileIdMatch[1] : null;
}

function openModal(productId) {
  // Fetch the detailed product information from the server using the product's unique identifier
  fetch(`/product-details/${productId}`)
    .then((response) => response.json())
    .then((productDetails) => {
      // 'productDetails' should be an object containing both 'product' and 'attributes' data
      const { product, attributes } = productDetails;

      // Populate modal with the main product info
      document.getElementById("modalProductName").textContent = product.Product_Name;
      document.getElementById("modalProductBrand").textContent = product.Product_Brand;
      document.getElementById("modalProductDescription").textContent = product.Product_Description;
      document.getElementById("modalProductIngredient").textContent = product.Product_Ingredients;
      document.getElementById("modalProductType").textContent = product.Product_Type;
      document.getElementById("modalProductGender").textContent = product.Product_Gender;

      // Use extractGoogleDriveId to get the Google Drive image ID and form the URL for the thumbnail
      const imageUrl = `https://drive.google.com/thumbnail?id=${extractGoogleDriveId(product.Product_image)}`;
      // Set the initial image
      document.getElementById("modalProductImage").src = imageUrl;

      // Assuming 'attributes' contains an array of objects { Product_Size: "50", Product_Price: 49.99 }
      const sizeSelect = document.getElementById("modalProductSize").querySelector('select');
      sizeSelect.innerHTML = ""; // Clear existing options
      attributes.forEach((attr) => {
        sizeSelect.innerHTML += `<option value="${attr.Product_Size}" data-price="${attr.Product_Price}">${attr.Product_Size} ml</option>`;
      });

      // Set the initial price based on the first size option
      document.getElementById("modalProductPrice").textContent = `$${attributes[0].Product_Price}`;

      // Listen for changes in the selected size to update the price
      sizeSelect.addEventListener('change', () => {
        const selectedOption = sizeSelect.options[sizeSelect.selectedIndex];
        const selectedPrice = selectedOption.getAttribute('data-price');
        document.getElementById("modalProductPrice").textContent = `$${selectedPrice}`;
      });

      // Show the modal
      document.getElementById("productModal").style.display = "block";
    })
    .catch((error) => console.error("Error fetching product details:", error));
}
// Function to close the modal
function closeModal() {
  document.getElementById("productModal").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  // Fetching products for containers with different product sets
  fetchProductsForContainer("first");
  fetchProductsForContainer("second");

  // Close functionality for the modal
  const modal = document.getElementById("productModal");
  const closeModalButton = document.querySelector(".modal .close");

  // Close the modal when the close button is clicked
  closeModalButton.addEventListener("click", closeModal);

  // Close the modal when clicking outside of it
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });
});

function fetchProductsForContainer(containerClass) {
  fetch("/random-products")
  .then(response => response.json())
  .then(products => {
    const container = document.querySelector(`.randomProductContainer.${containerClass}`);
    container.innerHTML = ""; // Clear the container

    // Iterate over the products and append them to the container
    products.forEach(product => {
      const imageUrl = `https://drive.google.com/thumbnail?id=${extractGoogleDriveId(product.Product_image)}`;

      const productDiv = document.createElement("div");
      productDiv.className = "perfume";
      productDiv.innerHTML = `
        <img src="${imageUrl}" alt="${product.Product_Name}" />
        <h2>${product.Product_Name}</h2>
        <p>By ${product.Product_Brand}</p>
        <p class="price">Price : ${product.Product_Price} $</p>
      `;

      container.appendChild(productDiv);

      // Update the event listener to pass the correct product ID
      productDiv.addEventListener("click", () => openModal(product.Product_ID));
    });
  })
  .catch(error => console.error("Error fetching products:", error));
}
