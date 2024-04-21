document.addEventListener("DOMContentLoaded", function () {
    const pName  = window.location.pathname.split('/').pop();
    fetchSearchResult(pName);
});

function fetchSearchResult(name){
    console.log("Product Name:", name); // Log the extracted product name

    if (name) {
        const url = `http://localhost:8000/searchByName/${encodeURIComponent(name)}`;
        fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch products: Server responded with ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (!data.products || data.products.length === 0) {
                throw new Error('No products found.');
            }
            const container = document.querySelector('.ProductSearchResult');
            container.innerHTML = ""; // Clear the container

            data.products.forEach(product => {
                const imageUrl = `https://drive.google.com/thumbnail?id=${extractGoogleDriveId(product.Product_image)}`;
                const productDiv = document.createElement("div");
                productDiv.className = "perfume";
                productDiv.innerHTML = `
                    <img src="${imageUrl}" alt="${product.Product_Name}" />
                    <h2>${product.Product_Name}</h2>
                    <p>By ${product.Product_Brand}</p>
                    <p class="price">Lowest Price: $${product.Min_Product_Price}</p>
                `;
            
                container.appendChild(productDiv);
            
                productDiv.addEventListener("click", () => {
                    window.location.href = `/product-page/${product.Product_ID}`;
                });
            });
        })
        .catch(error => {
            console.error("Error fetching products:", error);
            const container = document.querySelector('.ProductSearchResult');
            container.innerHTML = `<p>Error: ${error.message}</p>`; // Display error message in the container
        });
    }
}


function extractGoogleDriveId(url) {
    const fileIdMatch = url.match(/file\/d\/(.*?)\//);
    return fileIdMatch ? fileIdMatch[1] : null;
}
  

