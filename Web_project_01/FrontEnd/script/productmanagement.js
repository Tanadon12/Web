
// let editModal;
document.addEventListener("DOMContentLoaded", function () {
  // Initial setup
  // editModal = document.getElementById('editProductModal');

  updateProducts(1);
  initializeEventListeners();
});
document.getElementById("Sort").addEventListener("change", () => updateProducts());

function initializeEventListeners() {
  const addBtn = document.querySelector('.add-product-btn');
  const addModal = document.getElementById('addProductModal');
  const spanCloseAdd = document.querySelector('.close');
  const spanCloseEdit = document.querySelector('.close-edit');
  const viewSelector = document.getElementById("view");
  const paginationButtons = document.querySelectorAll(".frame");

  // Modal open and close handlers
  addBtn.onclick = () => toggleModal(addModal, true);
  spanCloseAdd.onclick = () => toggleModal(addModal, false);
  spanCloseEdit.onclick = () => toggleModal(editModal, false);

  // Close modals when clicking outside of them
  window.onclick = function(event) {
    if (event.target === addModal || event.target === editModal) {
      toggleModal(event.target, false);
    }
  };

  // Change handlers
  viewSelector.addEventListener("change", () => updateProducts(1));
  
  
  // Pagination controls
  paginationButtons.forEach(button => {
    button.addEventListener("click", function () {
      const pageNumber = this.textContent.trim() === ">" ?
        parseInt(document.querySelector(".frame.active")?.textContent || "1", 10) + 1 :
        parseInt(pageNumber, 10);
      updateProducts(pageNumber);
    });
  });

  
}

function updateProducts(page = 1) {
  const viewCount = document.getElementById("view").value;
  const sortOption = document.getElementById("Sort").value;
  const gender = window.location.pathname.split("/")[2] || "Unisex"; // Assuming 'Unisex' as default
  const url = `http://localhost:8000/Perfume/${gender}?limit=${viewCount}&page=${page}&sort=${sortOption}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
      return response.json();
    })
    .then(data => renderProducts(data))
    .catch(error => console.error("Error loading products:", error));
}

function renderProducts(data) {
  const container = document.querySelector(".products-container");
  container.innerHTML = ""; // Clear previous content
  const products = data.products;
  const totalPages = Math.ceil(data.totalProducts / parseInt(document.getElementById("view").value));

  products.forEach(product => {
    const productDiv = document.createElement("div");
    productDiv.className = "perfume";
    productDiv.dataset.productId = product.Product_ID; // Store product ID for easy access
    productDiv.innerHTML = `
      <img src="https://drive.google.com/thumbnail?id=${extractGoogleDriveId(product.Product_image)}" alt="${product.Product_Name}" />
      <h2>${product.Product_Name}</h2>
      <p>By ${product.Product_Brand}</p>
      <p class="price">Price : ${product.Product_Price} $</p>
      <button class="edit-btn">EDIT</button>
      <button class="delete-btn">DELETE</button>
    `;
    container.appendChild(productDiv);
    
    // Attach event listener to each edit button within the productDiv
    container.addEventListener("click", function(event) {
      const target = event.target;
      if (target.classList.contains('edit-btn')) {
        openEditModal(product.Product_ID);
      } else if (target.classList.contains('delete-btn')) {
        // Handle delete (additional code needed here if you have delete functionality)
      } else if (!target.classList.contains('edit-btn') && !target.classList.contains('delete-btn')) {
        const productId = target.closest('.perfume').dataset.productId;
        window.location.href = `/product-page/${productId}`;
      }
    });
  });

  updatePaginationControls(totalPages, parseInt(document.getElementById("view").value));
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

function toggleModal(modal, show) {
  modal.style.display = show ? 'block' : 'none';
}

function openEditModal(productId) {
  editModal = document.getElementById('editProductModal');
  console.log(productId)
  const url = `http://localhost:8000/product-details/${productId}`;
  console.log('Fetching details from:', url);  // This will help verify the URL is correct

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch product details: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Received product details:", data);  // Log to see what's received
      const { product, attributes } = data;
      
      // Populate the product details in form fields
      document.getElementById('editProductId').value = product.Product_ID;
      document.getElementById('editProductName').value = product.Product_Name;
      document.getElementById('editProductDescription').value = product.Product_Description;
      document.getElementById('editProductIngredient').value = product.Product_Ingredients;
      document.getElementById('editProductImage').value = product.Product_image;

      // Handle attributes - assuming attributes could have multiple entries
      // You would need to adjust this if you manage multiple attributes like different sizes/prices
      if (attributes && attributes.length > 0) {
        document.getElementById('editProductPrice').value = attributes[0].Product_Price; // Just as an example
        // If handling multiple sizes/prices, you might need to build UI elements dynamically here
      }

      // Show the modal
      toggleModal(editModal, true);
    })
    .catch(error => {
      console.error('Error loading product details:', error);
      alert(`Failed to load product details: ${error.message}`);
    });
}


// Utility function to extract Google Drive ID from URL
function extractGoogleDriveId(url) {
  const fileIdMatch = url.match(/file\/d\/(.*?)\//);
  return fileIdMatch ? fileIdMatch[1] : null;
}

