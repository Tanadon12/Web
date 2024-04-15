

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

var slideIndex = 1;
showSlides(slideIndex);

// Auto slide every 5 seconds (5000 milliseconds)
var slideInterval = setInterval(function() {
  moveSlide(1); // Move to the next slide
}, 3000);

// Pause auto sliding when mouse enters the slideshow container
document.querySelector('.slideshow-container').addEventListener('mouseenter', function() {
  clearInterval(slideInterval); // Clear the auto slide interval
});

// Resume auto sliding when mouse leaves the slideshow container
document.querySelector('.slideshow-container').addEventListener('mouseleave', function() {
  slideInterval = setInterval(function() {
    moveSlide(1); // Move to the next slide
  }, 3000);
});

function moveSlide(n) {
  clearInterval(slideInterval); // Clear the auto slide interval before manually moving the slide

  showSlides(slideIndex += n);

  // Restart auto sliding after 5 seconds
  slideInterval = setInterval(function() {
    moveSlide(1); // Move to the next slide
  }, 3000);
}

function currentSlide(n) {
  clearInterval(slideInterval); // Clear the auto slide interval before manually moving the slide

  showSlides(slideIndex = n);

  // Restart auto sliding after 5 seconds
  slideInterval = setInterval(function() {
    moveSlide(1); // Move to the next slide
  }, 3000);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("slide");
  var dots = document.getElementsByClassName("dot");
  
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  
  for (i = 0; i < slides.length; i++) {
      slides[i].style.opacity = "0";  
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  
  slides[slideIndex-1].style.opacity = "1";  
  dots[slideIndex-1].className += " active";
}


