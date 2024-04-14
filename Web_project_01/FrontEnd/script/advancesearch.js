// Initialize event listeners on DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  validatePriceRange();
  initializeSizeCheckboxes();
  initializeFormReset();
  initializeProductSearchOptions();
  initializeSearchFormSubmission();
});

// Price range validation function
function validatePriceRange() {
  const minPriceInput = document.getElementById("min-price");
  const maxPriceInput = document.getElementById("max-price");
  const minPriceWarning = document.getElementById("min-price-warning");
  const maxPriceWarning = document.getElementById("max-price-warning");

  let minPrice = parseInt(minPriceInput.value);
  let maxPrice = parseInt(maxPriceInput.value);

  minPriceWarning.style.display = "none";
  maxPriceWarning.style.display = "none";

  if (minPrice < 0) {
    minPriceInput.value = 0;
    minPriceWarning.style.display = "block";
  }

  if (maxPrice > 60000) {
    maxPriceInput.value = 60000;
    maxPriceWarning.style.display = "block";
  }

  if (minPrice > maxPrice) {
    minPriceInput.value = maxPrice;
  }

  if (maxPrice < minPrice) {
    maxPriceInput.value = minPrice;
  }
}

// Checkbox functionality for size options
function initializeSizeCheckboxes() {
  const sizeCheckboxes = document.querySelectorAll('.size-options input[type="checkbox"]');
  sizeCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const label = checkbox.parentElement;
      if (checkbox.checked) {
        label.classList.add('checked');
      } else {
        label.classList.remove('checked');
      }
    });
  });
}

// Form reset functionality to clear warnings and checkboxes
function initializeFormReset() {
  const form = document.querySelector(".search-form");
  form.addEventListener("reset", function () {
    setTimeout(function () {
      const checkboxes = document.querySelectorAll('.size-options input[type="checkbox"]');
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
        checkbox.parentNode.classList.remove("checked");
      });

      document.getElementById("min-price-warning").style.display = "none";
      document.getElementById("max-price-warning").style.display = "none";
    }, 0);
  });
}

// Fetch and populate product search options from server
function initializeProductSearchOptions() {
  fetch("http://localhost:8000/product-search-options")
    .then((response) => response.json())
    .then((data) => {
      populateDropdown("type", data.types);
      populateDropdown("brand", data.brands);
      populateDropdown("gender", data.genders);
      populateSizes(data.sizes);
    })
    .catch((error) => console.error("Error fetching search options:", error));
}

// Populate dropdown options
function populateDropdown(dropdownId, options) {
  const select = document.getElementById(dropdownId);
  Array.from(select.options).slice(1).forEach((option) => option.remove());
  options.forEach((optionValue) => {
    const option = document.createElement("option");
    option.value = optionValue;
    option.textContent = optionValue;
    select.appendChild(option);
  });
}

// Populate sizes checkboxes
function populateSizes(sizes) {
  const container = document.querySelector(".size-options");
  container.innerHTML = ''; // Clear previous checkboxes
  sizes.forEach((size) => {
    const label = document.createElement("label");
    label.className = "size-label";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "size";
    input.value = size;
    input.addEventListener("change", function () {
      label.classList.toggle('checked', input.checked);
    });
    label.appendChild(input);
    label.append(size);
    container.appendChild(label);
  });
}

// Handle search form submission to fetch products
function initializeSearchFormSubmission() {
  const form = document.querySelector(".search-form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    performSearch();
  });

  function performSearch() {
    const formData = new FormData(form);
    const searchParams = new URLSearchParams();
    for (const pair of formData) {
      searchParams.append(pair[0], pair[1]);
    }

    fetch("http://localhost:8000/searchRes", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: searchParams
    })
    .then((response) => response.json())
    .then((products) => {
      displayProducts(products);
    })
    .catch((error) => console.error("Error fetching search results:", error));
  }
}

// Display products on the page
function displayProducts(products) {
  const container = document.querySelector('.ProductSearchResult');
  container.innerHTML = ""; // Clear previous results
  container.style.display = 'none';

  if (products.length === 0) {
    container.innerHTML = "<h2>No product was found</h2>";
    container.style.display = 'block';
    return;
  }

  const titleContainer = document.createElement('div');
  titleContainer.className = 'product-search-title';
  titleContainer.innerHTML = `<h2>Product Search Result</h2>`;
  container.appendChild(titleContainer);

  const productsContainer = document.createElement('div');
  productsContainer.className = 'products-container';

  products.forEach(product => {
    const productDiv = document.createElement("div");
    productDiv.className = "perfume";
    const imageUrl = `https://drive.google.com/thumbnail?id=${extractGoogleDriveId(product.Product_image)}`;
    productDiv.innerHTML = `
      <div class="product-image">
        <img src="${imageUrl}" alt="${product.Product_Name}" />
      </div>
      <div class="product-info">
        <h2>${product.Product_Name}</h2>
        <p>By ${product.Product_Brand}</p>
        <p class="price">Price: ${product.Min_Product_Price} $ - ${product.Max_Product_Price} $</p>
      </div>
    `;
    productDiv.addEventListener("click", () => {
      window.location.href = `/product-page/${product.Product_ID}`;
    });
    productsContainer.appendChild(productDiv);
  });

  container.appendChild(productsContainer);
  container.style.display = 'block';
}

// Utility function to extract Google Drive ID from URL
function extractGoogleDriveId(url) {
  const fileIdMatch = url.match(/file\/d\/(.*?)\//);
  return fileIdMatch ? fileIdMatch[1] : null;
}
