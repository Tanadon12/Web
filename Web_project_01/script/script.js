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
  


  document.addEventListener('DOMContentLoaded', function() {
    fetch('/random-products') // Note the endpoint change to fetch multiple products
        .then(response => response.json())
        .then(products => { // Handle an array of products
            const container = document.getElementById('randomProductContainer');
            container.innerHTML = ''; // Clear existing content
            
            products.forEach(product => {
                // Extract the Google Drive ID from the Product_image URL
                const driveUrl = product.Product_image;
                const fileIdMatch = driveUrl.match(/file\/d\/(.*?)\//);
                const fileId = fileIdMatch ? fileIdMatch[1] : null;
                
                // Construct the thumbnail src URL
                const imageUrl = fileId ? `https://drive.google.com/thumbnail?id=${fileId}` : 'path/to/default/image.jpg';
            
                const htmlContent = `
                    <div class="perfume">
                        <img src="${imageUrl}" alt="${product.Product_Name}" />
                        <h2>${product.Product_Name}</h2>
                        <p>By ${product.Product_Brand}</p>
                        <p class="price">Price :  ${product.Product_Price} $</p>
                    </div>
                `;
                container.innerHTML += htmlContent; // Append new product content
            });
        })
        .catch(error => console.error('Error fetching random products:', error));
});

  
