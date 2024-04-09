function validatePriceRange() {
  const minPriceInput = document.getElementById('min-price');
  const maxPriceInput = document.getElementById('max-price');
  const minPriceWarning = document.getElementById('min-price-warning');
  const maxPriceWarning = document.getElementById('max-price-warning');
  
  let minPrice = parseInt(minPriceInput.value);
  let maxPrice = parseInt(maxPriceInput.value);

  // Reset warnings
  minPriceWarning.style.display = 'none';
  maxPriceWarning.style.display = 'none';

  // Validate min price
  if (minPrice < 0) {
    minPriceInput.value = 0; // Set the value back to 0
    minPriceWarning.style.display = 'block';
  }

  // Validate max price
  if (maxPrice > 60000) {
    maxPriceInput.value = 60000; // Set the value back to 60,000
    maxPriceWarning.style.display = 'block';
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
document.addEventListener('DOMContentLoaded', validatePriceRange);


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
  document.addEventListener('DOMContentLoaded', function() {
    // Get the form element
    const form = document.querySelector('.search-form');
    
    // Function to reset checkboxes
    function resetCheckboxes() {
      const checkboxes = document.querySelectorAll('.size-options input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        checkbox.checked = false; // Uncheck all checkboxes
        checkbox.parentNode.classList.remove('checked'); // Update class for visual change
      });
    }
  
    // Function to hide the warning messages
    function hideWarnings() {
      document.getElementById('min-price-warning').style.display = 'none';
      document.getElementById('max-price-warning').style.display = 'none';
    }
  
    // Reset event listener for the form
    form.addEventListener('reset', function() {
      setTimeout(function() {
        resetCheckboxes(); // Reset checkboxes after form reset
        hideWarnings(); // Hide any warning messages
      }, 0);
    });
  
    // Initialize values and warnings
    validatePriceRange();
  });

  document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:8000/product-search-options')
      .then(response => response.json())
      .then(data => {
        populateDropdown('type', data.types);
        populateDropdown('brand', data.brands);
        populateDropdown('gender', data.genders);
        populateSizes(data.sizes);
      })
      .catch(error => console.error('Error fetching search options:', error));
  });
  
  function populateDropdown(dropdownId, options) {
    const select = document.getElementById(dropdownId);
    // Clear existing options except the first one
    Array.from(select.options).slice(1).forEach(option => option.remove());
    // Append new options
    options.forEach(optionValue => {
      const option = document.createElement('option');
      option.value = optionValue;
      option.textContent = optionValue;
      select.appendChild(option);
    });
  }
  
  function populateSizes(sizes) {
    const container = document.querySelector('.size-options');
    // Clear existing checkboxes
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    // Create new checkboxes and directly attach event listeners
    sizes.forEach(size => {
      const label = document.createElement('label');
      label.className = 'size-label';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.name = 'size';
      input.value = size;
  
      // Attach an event listener directly to each new checkbox
      input.addEventListener('change', function() {
        // This toggles the 'checked' class on the label
        if (input.checked) {
          label.classList.add('checked');
        } else {
          label.classList.remove('checked');
        }
      });
  
      label.appendChild(input);
      label.append(size); // Text next to checkbox
      container.appendChild(label);
    });
  }
  
  
  
  