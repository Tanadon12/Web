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

document.addEventListener("DOMContentLoaded", function () {
  fetchProductsForContainer("first");
  fetchProductsForContainer("second");
});

// Utility function to extract Google Drive ID from URL
function extractGoogleDriveId(url) {
  const fileIdMatch = url.match(/file\/d\/(.*?)\//);
  return fileIdMatch ? fileIdMatch[1] : null;
}

let isHoveringProduct = false; // Tracks if hovering over any product
let isHoveringModal = false; // Tracks if hovering over the modal


function fetchProductsForContainer(containerClass) {
  fetch("/random-products")
  .then(response => response.json())
  .then(products => {
      const container = document.querySelector(`.randomProductContainer.${containerClass}`);
      container.innerHTML = ""; // Clear the container

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

          productDiv.addEventListener("click", () => {
            window.location.href = `/product-page/${product.Product_ID}`;
          });

          // Hover to show modal
          productDiv.addEventListener("mouseover", () => {
              isHoveringProduct = true;
              openModal(product.Product_ID);
          });
          productDiv.addEventListener("mouseleave", () => {
              isHoveringProduct = false;
              // Allow some time to move from product to modal
              setTimeout(() => {
                  if (!isHoveringModal) closeModal();
              }, 300); // Reduced delay to 300ms
          });
      });
  })
  .catch(error => console.error("Error fetching products:", error));
}


// function openModal(productId) {
//   fetch(`/product-details/${productId}`)
//     .then((response) => response.json())
//     .then((productDetails) => {
//       const { product, attributes } = productDetails;

//       // Populate modal with product info
//       document.getElementById("modalProductName").textContent = product.Product_Name;
//       document.getElementById("modalProductBrand").textContent = "Brand: " + product.Product_Brand;
//       document.getElementById("modalProductDescription").textContent = "Description: " + product.Product_Description;
//       document.getElementById("modalProductIngredient").textContent = "Ingredients: " + product.Product_Ingredients;
//       document.getElementById("modalProductType").textContent = "Type: " + product.Product_Type;
//       document.getElementById("modalProductGender").textContent = "Gender: " + product.Product_Gender;

//       const imageUrl = `https://drive.google.com/thumbnail?id=${extractGoogleDriveId(product.Product_image)}`;
//       document.getElementById("modalProductImage").src = imageUrl;

//       // Clear and populate size options
//       const sizeSelect = document.getElementById("modalProductSize").querySelector('select');
//       sizeSelect.innerHTML = attributes.map(attr => `<option value="${attr.Product_Size}" data-price="${attr.Product_Price}">${attr.Product_Size} ml</option>`).join('');

//       document.getElementById("modalProductPrice").textContent = "Price: $" + attributes[0].Product_Price;

//       sizeSelect.addEventListener('change', () => {
//         const selectedOption = sizeSelect.options[sizeSelect.selectedIndex];
//         const selectedPrice = selectedOption.getAttribute('data-price');
//         document.getElementById("modalProductPrice").textContent = "Price: $" + selectedPrice;
//       });

//       // Ensure modal reference is correct and modal is shown
//       const modal = document.getElementById("productModal");
//       modal.style.display = "block";

//       // Add hover state tracking for the modal
//       modal.onmouseover = () => isHoveringModal = true;
//       modal.onmouseleave = () => {
//         isHoveringModal = false;
//         setTimeout(() => {
//           if (!isHoveringProduct) closeModal();
//         }, 50); // Delay before checking hover state and closing
//       };
//     })
//     .catch((error) => console.error("Error fetching product details:", error));
// }

// function closeModal() {
//   const modal = document.getElementById("productModal");
//   modal.style.display = "none";
// }
