window.onload = async () => {
    try {
      const response = await fetch('/proxy/check_authen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': 'Bearer ' + localStorage.getItem("access_token")
        }
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const responseData = await response.json();
  
      if (responseData !== false) {
        console.log(responseData);
      } else {
        location.href = `${location.origin}/SignIn`;
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  function logout() {
    localStorage.clear();
    location.href = `${location.origin}/SignIn`;
  }
  
document.addEventListener("DOMContentLoaded", function () {
    initializeAccountEventListeners();
    fetchAccountDetails();
    
});

function fetchAccountDetails() {
    fetch(`/proxy/account`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch account details");
        }
        return response.json();
    })
    .then(data => {
        const container = document.getElementById('accountsContainer');
        data.forEach(account => {
            const accountDiv = document.createElement('div');
            accountDiv.className = 'account-item';
            accountDiv.innerHTML = `
                <div class="account-info">
                    <p>Username: <span>${account.Username}</span></p>
                    <p>Password: <span>${account.Password}</span></p> <!-- Consider security -->
                    <p>Firstname: <span>${account.First_Name}</span></p>
                    <p>Lastname: <span>${account.Last_Name}</span></p>
                    <p>Address: <span>${account.Address}</span></p>
                    <p>Email: <span>${account.Email}</span></p>
                    <p>Role: <span>${account.Acc_Role}</span></p>
                </div>
                <div class="account-actions">
                    <button class="edit-account-btn" data-account-id="${account.Account_ID}">EDIT</button>
                    <button class="delete-account-btn">DELETE</button>
                </div>
            `;
            
            accountDiv.addEventListener("click", function (event) {
                const target = event.target;
                if (target.classList.contains("edit-account-btn")) {
                    console.log("this part " + account.Account_ID);
                    openEditAccountModal(account.Account_ID);
                } else if (target.classList.contains("delete-account-btn")) {
                    deleteAccount(account.Account_ID);
                } 
              });

              container.appendChild(accountDiv);
        });

        
    })
    .catch(error => {
        console.error("Error:", error);
    });
}



function initializeAccountEventListeners() {
    const addAccountModal = document.getElementById('addAccountModal');
    const editAccountModal = document.getElementById('editAccountModal');
    const addAccountBtn = document.querySelector('.add-account-btn');
    const closeAddAccountBtn = document.querySelector('#addAccountModal .close');
    const closeEditAccountBtn = document.querySelector('#editAccountModal .close-edit');

    addAccountBtn.addEventListener('click', () => toggleModal(addAccountModal, true));
    closeAddAccountBtn.addEventListener('click', () => toggleModal(addAccountModal, false));
    closeEditAccountBtn.addEventListener('click', () => toggleModal(editAccountModal, false));

    const editAccountF = document.getElementById("editAccountForm");
    editAccountF.addEventListener('submit', function(event) {
        event.preventDefault();
        const accountId = document.getElementById('editAccountId').value;
        const formData = new FormData(editAccountForm);
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
          }
        submitForm(accountId, formData);
    });

    const addAccountF = document.getElementById("addAccountForm");
    addAccountF.addEventListener("submit", function (event) {
        event.preventDefault();
        const formAddData = new FormData(addAccountF);
        for (let [key, value] of formAddData.entries()) {
          console.log(`${key}: ${value}`);
        }
        submitNewAccount(formAddData);
      });

    window.onclick = function (event) {
        if (event.target === addAccountModal || event.target === editAccountModal) {
            toggleModal(event.target, false);
        }
    };
}


function submitNewAccount(formAddData) {
    console.log(formAddData);
    for (let [key, value] of formAddData.entries()) {
      console.log(`${key}: ${value}`);
    }
  
    fetch("http://localhost:8000/insert_account", {
      method: "POST",
      body: formAddData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("New Account added:", data);
        alert("Product Account successfully!");
        toggleModal(document.getElementById("addAccountModal"), false);
        location.reload();
      })
      .catch((error) => {
        console.error("Error adding new Account:", error);
        alert("Failed to add new Account: " + error.message);
      });
  }


function toggleModal(modal, show) {
    modal.style.display = show ? "block" : "none";
}




function openEditAccountModal(accountId) {
    fetch(`http://localhost:8000/getAccount/${accountId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to fetch account details: ${response.statusText}`);
        }
        return response.json();
    })
    .then(account => {
        const { Account_ID, First_Name, Last_Name, Email, Address, Username, Password, Acc_Role } = account;
        document.getElementById('editAccountId').value = Account_ID;
        document.getElementById('editFirstName').value = First_Name;
        document.getElementById('editLastName').value = Last_Name;
        document.getElementById('editEmail').value = Email;
        document.getElementById('editAddress').value = Address;
        document.getElementById('editUsername').value = Username;
        // Consider not auto-filling passwords for security, use a placeholder
        document.getElementById('editPassword').value = Password;
        document.getElementById('editRole').value = Acc_Role;
        toggleModal(document.getElementById('editAccountModal'), true);
    })
    .catch(error => {
        console.error('Error fetching account details:', error);
        alert(`Failed to load account details: ${error.message}`);
    });
}


function deleteAccount(accountId) {
    if (confirm('Are you sure you want to delete this account?')) {
        fetch(`/proxy/deleteAccount/${accountId}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(result => {
                alert('Account deleted successfully');
                
            })
            .catch(error => console.error('Failed to delete account:', error));
    }
    location.reload();
}

function submitForm(accountId, formData) {
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
    
    console.log("Submitting form for account ID:", accountId);
    fetch(`/proxy/editAccount/${accountId}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Object.fromEntries(formData))
    })
    .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        alert("Account updated successfully!");
        console.log("Success:", data);
        toggleModal(document.getElementById('editAccountModal'), false);
        location.reload();
    })
    .catch((error) => {
        console.error("Error:", error);
        alert("Failed to update account: " + error.message);
    });
}