// Get modals
var addModal = document.getElementById('addProductModal');
var editModal = document.getElementById('editProductModal');

// Get buttons
var addBtn = document.getElementsByClassName('add-product-btn')[0];
var editBtns = document.getElementsByClassName('edit-btn');

// Get close buttons
var spanCloseAdd = document.getElementsByClassName('close')[0];
var spanCloseEdit = document.getElementsByClassName('close-edit')[0];

// Function to toggle modal display
function toggleModal(modal, show) {
  modal.style.display = show ? 'block' : 'none';
}

// Open the Add Product modal
addBtn.onclick = function() {
  toggleModal(addModal, true);
};

// Close the Add Product modal
spanCloseAdd.onclick = function() {
  toggleModal(addModal, false);
};

// Function to open the Edit Product modal
function openEditModal() {
  toggleModal(editModal, true);
  // TODO: Populate form fields with product details
}

// Attach openEditModal to each edit button
for (var i = 0; i < editBtns.length; i++) {
  editBtns[i].onclick = openEditModal;
}

// Close the Edit Product modal
spanCloseEdit.onclick = function() {
  toggleModal(editModal, false);
};

// Close modals when clicking outside of them
window.onclick = function(event) {
  if (event.target == addModal || event.target == editModal) {
    toggleModal(event.target, false);
  }
};

// TODO: Add form submission logic here, including validation and image handling

function updateProducts(page = 1) {
  const viewCount = document.getElementById("view").value;
  const sortOption = document.getElementById("Sort").value;

  // Determine the base URL path and adjust gender parameter accordingly
  const urlPath = window.location.pathname.split("/");
  let gender = urlPath[2]; // Default to assuming gender is the third URL segment

  // Check and adjust the gender based on known valid values
  if (gender !== "Men" && gender !== "Woman") {
    gender = "Unisex"; // Default to 'Unisex' if an unexpected value is found
  }

  // Construct the URL with proper query parameters
  let fetchUrl = `http://localhost:8000/Perfume/${gender}?limit=${viewCount}&page=${page}&sort=${sortOption}`;

  console.log("URL being requested:", fetchUrl); // This will show the full URL being requested

  fetch(fetchUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      const products = data.products;
      const totalProducts = data.totalProducts;
      const totalPages = Math.ceil(totalProducts / viewCount);

      const container = document.querySelector(".products-container");
      container.innerHTML = "";
      products.forEach((product) => {
        const imageUrl = `https://drive.google.com/thumbnail?id=${extractGoogleDriveId(product.Product_image)}`;
        const productDiv = document.createElement("div");
        productDiv.className = "perfume";
        productDiv.innerHTML = `
            <img src="${imageUrl}" alt="${product.Product_Name}" />
            <h2>${product.Product_Name}</h2>
            <p>By ${product.Product_Brand}</p>
            <p class="price">Price : ${product.Product_Price} $</p>
            <button class="edit-btn">EDIT</button>
            <button class="delete-btn">DELETE</button>
          `;
        // Append event listener for the whole div
        productDiv.addEventListener("click", (event) => {
          if (!event.target.classList.contains('edit-btn') && !event.target.classList.contains('delete-btn')) {
            window.location.href = `/product-page/${product.Product_ID}`;
          }
        });
        container.appendChild(productDiv);
      });

      updatePaginationControls(totalPages, page);
    })
    .catch((error) => {
      console.error("Error loading products:", error);
    });
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
document.addEventListener("DOMContentLoaded", function () {
  updateProducts(1);  // Consider renaming to ensure it's the correct function being called
  document.getElementById("view").addEventListener("change", function () {
    updateProducts(1);
  });
  // Setup pagination and sort event listeners here too
});

document.addEventListener("DOMContentLoaded", function() {
  const container = document.querySelector(".products-container");
  container.addEventListener("click", function(event) {
    if (event.target.classList.contains('edit-btn')) {
      // Handle edit
      openEditModal();
    } else if (event.target.classList.contains('delete-btn')) {
      // Handle delete
    }
  });
});
