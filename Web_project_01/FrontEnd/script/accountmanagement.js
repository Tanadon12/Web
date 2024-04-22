document.addEventListener("DOMContentLoaded", function () {
    fetchAccountDetails();
  });
  
  function fetchAccountDetails() {
      fetch(`http://localhost:8000/getAccount`)
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to fetch account details");
          }
          return response.json();
        })
        .then(data => {
          const container = document.getElementById('accountsContainer'); // Make sure you have this container in your HTML
          data.forEach(account => {
            const accountDiv = document.createElement('div');
            accountDiv.className = 'account-item';
            accountDiv.innerHTML = `
              <div class="account-info">
                <p>Username: <span>${account.Username}</span></p>
                <p>Password: <span>${account.Password}</span></p> <!-- Consider hiding or masking this -->
                <p>Firstname: <span>${account.First_Name}</span></p>
                <p>Lastname: <span>${account.Last_Name}</span></p>
                <p>Address: <span>${account.Address}</span></p>
                <p>Email: <span>${account.Email}</span></p>
              </div>
              <div class="account-actions">
                <button class="edit-account-btn">EDIT</button>
                <button class="delete-account-btn">DELETE</button>
              </div>
            `;
            container.appendChild(accountDiv);
          });
        })
        .catch(error => {
          console.error("Error:", error);
        });
  }
  