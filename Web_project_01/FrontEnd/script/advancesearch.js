function validatePriceRange() {
  const minPriceInput = document.getElementById("min-price");
  const maxPriceInput = document.getElementById("max-price");
  const minPriceWarning = document.getElementById("min-price-warning");
  const maxPriceWarning = document.getElementById("max-price-warning");

  let minPrice = parseInt(minPriceInput.value);
  let maxPrice = parseInt(maxPriceInput.value);

  // Reset warnings
  minPriceWarning.style.display = "none";
  maxPriceWarning.style.display = "none";

  // Validate min price
  if (minPrice < 0) {
    minPriceInput.value = 0; // Set the value back to 0
    minPriceWarning.style.display = "block";
  }

  // Validate max price
  if (maxPrice > 60000) {
    maxPriceInput.value = 60000; // Set the value back to 60,000
    maxPriceWarning.style.display = "block";
  }

  // Ensure min is not greater than max
  if (minPrice > maxPrice) {
    minPriceInput.value = maxPrice;
  }

  // Ensure max is not less than min
  if (maxPrice < minPrice) {
    maxPriceInput.value = minPrice;
  }
}

// Initialize values and warnings on page load
document.addEventListener("DOMContentLoaded", validatePriceRange);

// //SIZE JS
//   document.addEventListener('DOMContentLoaded', function() {
//     // This function updates the class on labels when their checkboxes are toggled
//     function updateLabelClass(checkbox) {
//       const label = checkbox.parentElement;
//       if (checkbox.checked) {
//         label.classList.add('checked');
//       } else {
//         label.classList.remove('checked');
//       }
//     }

//     // Select all size checkboxes
//     const sizeCheckboxes = document.querySelectorAll('.size-options input[type="checkbox"]');

//     // Initialize each checkbox
//     sizeCheckboxes.forEach(checkbox => {
//       // Update the label class based on the checkbox initial state
//       updateLabelClass(checkbox);

//       // Attach a change event listener to toggle the class
//       checkbox.addEventListener('change', function() {
//         updateLabelClass(checkbox);
//       });
//     });
//   });
//   //END OF SIZE JS

//CLEAR BUTTON JS
document.addEventListener("DOMContentLoaded", function () {
  // Get the form element
  const form = document.querySelector(".search-form");

  // Function to reset checkboxes
  function resetCheckboxes() {
    const checkboxes = document.querySelectorAll(
      '.size-options input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false; // Uncheck all checkboxes
      checkbox.parentNode.classList.remove("checked"); // Update class for visual change
    });
  }

  // Function to hide the warning messages
  function hideWarnings() {
    document.getElementById("min-price-warning").style.display = "none";
    document.getElementById("max-price-warning").style.display = "none";
  }

  // Reset event listener for the form
  form.addEventListener("reset", function () {
    setTimeout(function () {
      resetCheckboxes(); // Reset checkboxes after form reset
      hideWarnings(); // Hide any warning messages
    }, 0);
  });

  // Initialize values and warnings
  validatePriceRange();
});

document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:8000/product-search-options")
    .then((response) => response.json())
    .then((data) => {
      populateDropdown("type", data.types);
      populateDropdown("brand", data.brands);
      populateDropdown("gender", data.genders);
      populateSizes(data.sizes);
    })
    .catch((error) => console.error("Error fetching search options:", error));
});

function populateDropdown(dropdownId, options) {
  const select = document.getElementById(dropdownId);
  // Clear existing options except the first one
  Array.from(select.options)
    .slice(1)
    .forEach((option) => option.remove());
  // Append new options
  options.forEach((optionValue) => {
    const option = document.createElement("option");
    option.value = optionValue;
    option.textContent = optionValue;
    select.appendChild(option);
  });
}

function populateSizes(sizes) {
  const container = document.querySelector(".size-options");
  // Clear existing checkboxes
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  // Create new checkboxes and directly attach event listeners
  sizes.forEach((size) => {
    const label = document.createElement("label");
    label.className = "size-label";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "size";
    input.value = size;

    // Attach an event listener directly to each new checkbox
    input.addEventListener("change", function () {
      // This toggles the 'checked' class on the label
      if (input.checked) {
        label.classList.add("checked");
      } else {
        label.classList.remove("checked");
      }
    });

    label.appendChild(input);
    label.append(size); // Text next to checkbox
    container.appendChild(label);
  });
}

// Utility function to extract Google Drive ID from URL
function extractGoogleDriveId(url) {
  const fileIdMatch = url.match(/file\/d\/(.*?)\//);
  return fileIdMatch ? fileIdMatch[1] : null;
}

document.addEventListener("DOMContentLoaded", function () {
  // ... other initialization code ...

  const resultsContainer = document.querySelector('.ProductSearchResult');
  resultsContainer.style.display = 'none';

  const searchForm = document.querySelector(".search-form");

  // Event listener for the search form submission
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission
    performSearch();
  });

  function performSearch() {
    const formData = new FormData(searchForm);
    const searchParams = new URLSearchParams();
    for (const pair of formData) {
      searchParams.append(pair[0], pair[1]);
    }

    fetch("http://localhost:8000/searchRes", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: searchParams,
    })
      .then((response) => response.json())
      .then((products) => {
        displayProducts(products);
      })
      .catch((error) => console.error("Error fetching search results:", error));
  }
});

function displayProducts(products) {
  const container = document.querySelector('.ProductSearchResult');
  container.style.display = 'none'; // Ensure it's hidden before we decide what to do next
  container.innerHTML = ""; // Clear previous results

  // Check if there are no products
  if (products.length === 0) {
    container.innerHTML = "<h2>No product was found</h2>";
    container.style.display = 'block'; // Show the container with the "no products" message
    return; // Exit the function early since there are no products to display
  }
  // Create and append the title
  const titleContainer = document.createElement('div');
  titleContainer.className = 'product-search-title';
  titleContainer.innerHTML = `<h2>Product Search Result</h2>`;
  container.appendChild(titleContainer);

  // Create a container for the products
  const productsContainer = document.createElement('div');
  productsContainer.className = 'products-container';

  products.forEach(product => {
    const imageUrl = `https://drive.google.com/thumbnail?id=${extractGoogleDriveId(product.Product_image)}`;
    const productDiv = document.createElement("div");
    productDiv.className = "perfume";
    
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

    // Append the product to the products container
    productsContainer.appendChild(productDiv);

    // Click event to redirect to the product page
    productDiv.addEventListener("click", () => {
      window.location.href = `/product-page/${product.Product_ID}`;
    });
  });

  // Append the products container to the main container after the title
  container.appendChild(productsContainer);
  container.style.display = 'block';
}


