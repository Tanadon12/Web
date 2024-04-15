

document.addEventListener("DOMContentLoaded", function () {
  fetchProductsForContainer("first");
  fetchProductsForContainer("second");
});

// Utility function to extract Google Drive ID from URL
function extractGoogleDriveId(url) {
  const fileIdMatch = url.match(/file\/d\/(.*?)\//);
  return fileIdMatch ? fileIdMatch[1] : null;
}




function fetchProductsForContainer(containerClass) {
  const backendBaseUrl = "http://localhost:8000";
  fetch("http://localhost:8000/random-products")
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

      
      });
  })
  .catch(error => console.error("Error fetching products:", error));
}
