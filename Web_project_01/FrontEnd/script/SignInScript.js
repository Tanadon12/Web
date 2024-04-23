// script.js (See password Buttom)
console.log("Script loaded successfully!");

async function submitForm(event) {
  event.preventDefault(); // Prevent the form from submitting normally
  
  // Get the values entered by the user
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  // Create an object to hold the form data
  var formData = {
    username: username,
    password: password
  };
  
  try {
    const response = await fetch('/proxy/submit_login', { // Use the proxy endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const responseData = await response.json();

    if (responseData.status === "0") {
        alert("Not found");
    } else if (responseData.status === "1") {
        localStorage.setItem("access_token", responseData.access_token);
        location.href = `${location.origin}/ProductMM`;
    }
  } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
  };
}

document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.getElementById("password");
    const togglePasswordButton = document.getElementById("togglePassword");
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    console.log("Username: " + username);
    console.log("Password: " + password);

  
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