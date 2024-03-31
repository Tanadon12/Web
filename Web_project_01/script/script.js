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

// document.addEventListener("DOMContentLoaded", function () {
//   fetch("/random-products")
//     .then((response) => response.json())
//     .then((products) => {
//       const containers = document.querySelectorAll(".randomProductContainer");

//       // Assuming you want to fill all containers with the same products
//       containers.forEach((container) => {
//         container.innerHTML = ""; // Clear existing content if necessary

//         products.forEach((product) => {
//           // Extract the Google Drive ID from the Product_image URL
//           const driveUrl = product.Product_image;
//           const fileIdMatch = driveUrl.match(/file\/d\/(.*?)\//);
//           const fileId = fileIdMatch ? fileIdMatch[1] : null;

//           // Construct the thumbnail src URL
//           const imageUrl = fileId
//             ? `https://drive.google.com/thumbnail?id=${fileId}`
//             : "path/to/default/image.jpg";

//           const htmlContent = `
//                         <div class="perfume">
//                             <img src="${imageUrl}" alt="${product.Product_Name}" />
//                             <h2>${product.Product_Name}</h2>
//                             <p>By ${product.Product_Brand}</p>
//                             <p class="price">Price :  ${product.Product_Price} $</p>
//                         </div>
//                     `;
//           container.innerHTML += htmlContent; // Append new product content to each container
//         });
//       });
//     })
//     .catch((error) => console.error("Error fetching random products:", error));
// });

document.addEventListener("DOMContentLoaded", function () {
  fetchProductsForContainer("first");
  fetchProductsForContainer("second");
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

