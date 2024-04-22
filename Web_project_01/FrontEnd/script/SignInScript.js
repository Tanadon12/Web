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
    const response = await fetch('http://localhost:8000/submit_login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
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
  
  // Send the form data to the server using the Fetch API
  // fetch("http://localhost:8000/submit_login", {
  //   method: "POST",
  //   body: JSON.stringify(formData),
  //   headers: {
  //     "Content-Type": "application/json"
  //   }
  // })
  // .then(response => {
  //   if (response.ok) {
  //     console.error("Login sucesss:");
  //     window.location.href = "/ProductMM";
  //     // If the response is OK (status code 200), redirect the user to /ProductMM
  //   } else {
  //     console.error("Login failed:", response.statusText);
  //   }
  // }).then(response => {
  //   if (response.ok) {
  //     console.error("Login sucesss:");
  //     window.location.href = "/ProductMM";
  //     // If the response is OK (status code 200), redirect the user to /ProductMM
  //   } else {
  //     console.error("Login failed:", response.statusText);
  //   }
  // })
  // .catch(error => {
  //   console.error("Error:", error);
  // });
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