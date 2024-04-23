document.addEventListener("DOMContentLoaded", function () {
  fetchProductsForContainer("first");
});

function fetchProductsForContainer(containerClass) {
  const backendBaseUrl = "http://localhost:8000";
  // Extract gender from the URL if present
  const urlPath = window.location.pathname.split("/");
  const gender =
    urlPath[1] === "Perfume" && (urlPath[2] === "Men" || urlPath[2] === "Woman")
      ? urlPath[2]
      : null;

  // Construct the URL with the gender parameter if available
  let fetchUrl = `/proxy/random-products`;
  if (gender) {
    fetchUrl += `?gender=${gender}`;
  }

  fetch(fetchUrl)
    .then((response) => response.json())
    .then((products) => {
      const container = document.querySelector(
        `.randomProductContainer.${containerClass}`
      );
      container.innerHTML = ""; // Clear the container

      products.forEach((product) => {
        const imageUrl = `https://drive.google.com/thumbnail?id=${extractGoogleDriveId(
          product.Product_image
        )}`;
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
    .catch((error) => console.error("Error fetching products:", error));
}

// Utility function to extract Google Drive ID from URL
function extractGoogleDriveId(url) {
  const fileIdMatch = url.match(/file\/d\/(.*?)\//);
  return fileIdMatch ? fileIdMatch[1] : null;
}

document.addEventListener("DOMContentLoaded", function () {
  fetchAndDisplayProducts(1); // Initially load the first page

  // Add event listener to the view selector to reload products when the view changes
document.getElementById("view").addEventListener("change", function () {
    fetchAndDisplayProducts(1); // Always go back to the first page when view changes
});

  // Event listeners for pagination
const paginationButtons = document.querySelectorAll(".frame");
  paginationButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const pageNumber = this.textContent.trim();
      if (pageNumber === ">") {
        const currentPage = parseInt(
          document.querySelector(".frame.active")?.textContent || "1",
          10
        );
        fetchAndDisplayProducts(currentPage + 1);
      } else {
        fetchAndDisplayProducts(parseInt(pageNumber, 10));
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  updateProducts(); // Initial load

  // Event listener for changing view
  document.getElementById("view").addEventListener("change", updateProducts);

  // Pagination controls
  document.querySelectorAll(".frame").forEach((frame) => {
    frame.addEventListener("click", function () {
      const pageNum = this.innerText.trim();
      updateProducts(pageNum); // Load specific page
    });
  });
});

function updateProducts(page = 1) {
  const viewCount = document.getElementById("view").value;
  const sortOption = document.getElementById("Sort").value;
  const gender = window.location.pathname.split("/")[2];
  const url = `http://localhost:8000/Perfume/${gender}?limit=${viewCount}&page=${page}&sort=${sortOption}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const products = data.products;
      const totalProducts = data.totalProducts;
      const totalPages = Math.ceil(totalProducts / viewCount);

      const container = document.querySelector(".products-container");
      container.innerHTML = "";
      products.forEach((product) => {
        const imageUrl = `https://drive.google.com/thumbnail?id=${extractGoogleDriveId(
          product.Product_image
        )}`;
        const productDiv = document.createElement("div");
        productDiv.className = "perfume";
        productDiv.innerHTML = `
            <img src="${imageUrl}" alt="${product.Product_Name}" />
            <h2>${product.Product_Name}</h2>
            <p>By ${product.Product_Brand}</p>
            <p class="price">Price : ${product.Product_Price} $</p>
          `;
        productDiv.addEventListener("click", () => {
          window.location.href = `/product-page/${product.Product_ID}`;
        });
        container.appendChild(productDiv);
      });

      updatePaginationControls(totalPages, page);
    })
    .catch((error) => console.error("Error loading products:", error));
}

function updatePaginationControls(totalPages, currentPage) {
  const pagination = document.querySelector(".frame-group");
  pagination.innerHTML = ""; // Clear existing pagination controls

  for (let i = 1; i <= totalPages; i++) {
    const pageElement = document.createElement("div");
    pageElement.className = "frame" + (i === currentPage ? " active" : "");
    pageElement.textContent = i;
    pageElement.addEventListener("click", () => updateProducts(i));
    pagination.appendChild(pageElement);
  }
}

// Listen for changes in the sort selection
document
  .getElementById("Sort")
  .addEventListener("change", () => updateProducts());
