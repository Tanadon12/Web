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