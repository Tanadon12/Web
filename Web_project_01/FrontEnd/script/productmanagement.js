let editProductForm = document.getElementById("editProductForm");
document.addEventListener("DOMContentLoaded", function () {
  // Initial setup

  const editProductForm = document.getElementById("editProductForm");
  editProductForm.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log(editProductForm.value);
    const formData = new FormData(editProductForm);
    const productId = document.getElementById("editProductId").value;
    submitForm(productId, formData);
  });

  const addProductForm = document.getElementById("addProductForm");
  addProductForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const formAddData = new FormData(addProductForm);
    for (let [key, value] of formAddData.entries()) {
      console.log(`${key}: ${value}`);
    }
    submitNewProduct(formAddData);
  });

  updateProducts(1);
  initializeEventListeners();
});

document
  .getElementById("Sort")
  .addEventListener("change", () => updateProducts());

function initializeEventListeners() {
  const addBtn = document.querySelector(".add-product-btn");
  const addModal = document.getElementById("addProductModal");
  const spanCloseAdd = document.querySelector(".close");
  const spanCloseEdit = document.querySelector(".close-edit");
  const viewSelector = document.getElementById("view");
  const paginationButtons = document.querySelectorAll(".frame");
  // Make sure editModal is defined here
  const editModal = document.getElementById("editProductModal");
  // const addProductForm = document.getElementById("addProductForm");

  // Modal open and close handlers
  addBtn.onclick = () => toggleModal(addModal, true);
  spanCloseAdd.onclick = () => toggleModal(addModal, false);
  spanCloseEdit.onclick = () => toggleModal(editModal, false);

  // Close modals when clicking outside of them
  window.onclick = function (event) {
    if (event.target === addModal || event.target === editModal) {
      toggleModal(event.target, false);
    }
  };

  // Change handlers
  viewSelector.addEventListener("change", () => updateProducts(1));

  // Pagination controls
  paginationButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const pageNumber =
        this.textContent.trim() === ">"
          ? parseInt(
              document.querySelector(".frame.active")?.textContent || "1",
              10
            ) + 1
          : parseInt(pageNumber, 10);
      updateProducts(pageNumber);
    });
  });
}

function submitNewProduct(formAddData) {
  // const addProductForm = document.getElementById('addProductForm');
  // const formData = new FormData(addProductForm);
  console.log(formAddData);
  for (let [key, value] of formAddData.entries()) {
    console.log(`${key}: ${value}`);
  }

  fetch("http://localhost:8000/insert_product", {
    method: "POST",
    body: formAddData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("New product added:", data);
      alert("Product added successfully!");
      toggleModal(document.getElementById("addProductModal"), false);
      updateProducts(); // Refresh the list to show the new product
    })
    .catch((error) => {
      console.error("Error adding new product:", error);
      alert("Failed to add new product: " + error.message);
    });
}

function submitForm(productId, formData) {
  console.log("Submitting form for product ID:", productId);
  fetch(`http://localhost:8000/editproduct/${productId}`, {
    method: "PUT",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      alert("Product updated successfully!");
      console.log("Success:", data);
      toggleModal(editModal, false);
      updateProducts();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Failed to update product: " + error.message);
    });
}

function updateProducts(page = 1) {
  const viewCount = document.getElementById("view").value;
  const sortOption = document.getElementById("Sort").value;
  const gender = window.location.pathname.split("/")[2] || "Unisex"; // Assuming 'Unisex' as default
  const url = `http://localhost:8000/Perfume/${gender}?limit=${viewCount}&page=${page}&sort=${sortOption}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText);
      }
      return response.json();
    })
    .then((data) => renderProducts(data, page))
    .catch((error) => console.error("Error loading products:", error));
}

function updatePaginationControls(totalPages, currentPage) {
  const pagination = document.querySelector(".frame-group");
  pagination.innerHTML = ""; // Clear existing pagination controls

  for (let i = 1; i <= totalPages; i++) {
    const pageElement = document.createElement("div");
    pageElement.className = "frame" + (i === currentPage ? " active" : "");
    pageElement.textContent = i;
    pageElement.addEventListener("click", function () {
      updateProducts(i); // This function needs to handle data fetching and updating the DOM
    });
    pagination.appendChild(pageElement);
  }
}

function renderProducts(data, page) {
  const viewCount = document.getElementById("view").value;
  const container = document.querySelector(".products-container");
  container.innerHTML = ""; // Clear previous content
  const products = data.products;
  const totalPages = Math.ceil(
    data.totalProducts / parseInt(document.getElementById("view").value)
  );
  // const totalPages = Math.ceil(
  //   data.totalProducts / parseInt(document.getElementById("view").value)
  // );

  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.className = "perfume";
    productDiv.dataset.productId = product.Product_ID; // Store product ID for easy access
    productDiv.innerHTML = `
      <img src="https://drive.google.com/thumbnail?id=${extractGoogleDriveId(
        product.Product_image
      )}" alt="${product.Product_Name}" />
      <h2>${product.Product_Name}</h2>
      <p>By ${product.Product_Brand}</p>
      <p class="price">Price : ${product.Product_Price} $</p>
      <button class="edit-btn">EDIT</button>
      <button class="delete-btn">DELETE</button>
    `;

    productDiv.addEventListener("click", function (event) {
      const target = event.target;
      if (target.classList.contains("edit-btn")) {
        openEditModal(product.Product_ID);
      } else if (target.classList.contains("delete-btn")) {
        deleteProduct(product.Product_ID);
      } else if (
        !target.classList.contains("edit-btn") &&
        !target.classList.contains("delete-btn")
      ) {
        const productId = target.closest(".perfume").dataset.productId;
        window.location.href = `/product-page/${productId}`;
      }
    });
    container.appendChild(productDiv);

    // Attach event listener to each edit button within the productDiv
  });

  updatePaginationControls(totalPages, page);
}

function deleteProduct(productId) {
  if (confirm("Are you sure you want to delete this product?")) {
    const url = `http://localhost:8000/delete/${productId}`;
    fetch(url, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete the product");
        }
        return response.json();
      })
      .then((data) => {
        alert("Product deleted successfully!");
        updateProducts();
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
        alert("Error deleting product: " + error.message);
      });
  }
}

function toggleModal(modal, show) {
  modal.style.display = show ? "block" : "none";
}

function openEditModal(productId) {
  editModal = document.getElementById("editProductModal");
  // console.log(productId);
  const url = `http://localhost:8000/product-details/${productId}`;
  console.log("Fetching details from:", url); // This will help verify the URL is correct

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Failed to fetch product details: ${response.statusText}`
        );
      }
      return response.json();
    })
    .then((data) => {
      console.log("Received product details:", data); // Log to see what's received
      const { product, attributes } = data;
      // Populate the product details in form fields
      document.getElementById("editProductId").value = product.Product_ID;
      document.getElementById("editProductName").value = product.Product_Name;
      document.getElementById("editProductDescription").value =
        product.Product_Description;
      document.getElementById("editProductIngredient").value =
        product.Product_Ingredients;
      // document.getElementById("EditProductImage2").value = product.Product_image;

      // Handle attributes - assuming attributes could have multiple entries
      // You would need to adjust this if you manage multiple attributes like different sizes/prices
      let sizeSelect = document.getElementById("editProductSize");
      sizeSelect.innerHTML = attributes
        .map(
          (attr) =>
            `<option value="${attr.Product_Size}" data-price="${attr.Product_Price}">${attr.Product_Size} ml</option>`
        )
        .join("");

      // Initialize price with the first attribute
      document.getElementById("editProductPrice").value =
        attributes[0].Product_Price;

      sizeSelect.addEventListener("change", () => {
        let selectedPrice =
          sizeSelect.options[sizeSelect.selectedIndex].getAttribute(
            "data-price"
          );
        document.getElementById("editProductPrice").value = selectedPrice;
      });
      // Show the modal
      toggleModal(editModal, true);
    })
    .catch((error) => {
      console.error("Error loading product details:", error);
      alert(`Failed to load product details: ${error.message}`);
    });
}

// Utility function to extract Google Drive ID from URL
function extractGoogleDriveId(url) {
  const fileIdMatch = url.match(/file\/d\/(.*?)\//);
  return fileIdMatch ? fileIdMatch[1] : null;
}
