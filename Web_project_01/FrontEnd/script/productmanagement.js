// Get modals
var addModal = document.getElementById('addProductModal');
var editModal = document.getElementById('editProductModal');

// Get buttons
var addBtn = document.getElementsByClassName('add-product-btn')[0];
var editBtns = document.getElementsByClassName('edit-btn');

// Get close buttons
var spanCloseAdd = document.getElementsByClassName('close')[0];
var spanCloseEdit = document.getElementsByClassName('close-edit')[0];

// Function to toggle modal display
function toggleModal(modal, show) {
  modal.style.display = show ? 'block' : 'none';
}

// Open the Add Product modal
addBtn.onclick = function() {
  toggleModal(addModal, true);
};

// Close the Add Product modal
spanCloseAdd.onclick = function() {
  toggleModal(addModal, false);
};

// Function to open the Edit Product modal
function openEditModal() {
  toggleModal(editModal, true);
  // TODO: Populate form fields with product details
}

// Attach openEditModal to each edit button
for (var i = 0; i < editBtns.length; i++) {
  editBtns[i].onclick = openEditModal;
}

// Close the Edit Product modal
spanCloseEdit.onclick = function() {
  toggleModal(editModal, false);
};

// Close modals when clicking outside of them
window.onclick = function(event) {
  if (event.target == addModal || event.target == editModal) {
    toggleModal(event.target, false);
  }
};

// TODO: Add form submission logic here, including validation and image handling
