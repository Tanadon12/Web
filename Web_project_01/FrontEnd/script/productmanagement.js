 // Get modals
 var addModal = document.getElementById('addProductModal');
 var editModal = document.getElementById('editProductModal');
 
 // Get the "Add Product" button and "Edit" buttons
 var addBtn = document.getElementsByClassName('add-product-btn')[0];
 var editBtns = document.getElementsByClassName('edit-btn'); // This will be a collection
 
 // Get the <span> elements that close the modals
 var spanCloseAdd = document.getElementsByClassName('close')[0];
 var spanCloseEdit = document.getElementsByClassName('close-edit')[0];
 
 // Open the Add Product modal
 addBtn.onclick = function() {
   addModal.style.display = 'block';
 }
 
 // Close the Add Product modal
 spanCloseAdd.onclick = function() {
   addModal.style.display = 'none';
 }
 
 // Function to open the Edit Product modal
 function openEditModal() {
   editModal.style.display = 'block';
   // Here you would populate the form with the product's current details
   // You'll need to get the product's details and fill them in the inputs
 }
 
 // Attach openEditModal to each edit button
 for (var i = 0; i < editBtns.length; i++) {
   editBtns[i].onclick = openEditModal;
 }
 
 // Close the Edit Product modal
 spanCloseEdit.onclick = function() {
   editModal.style.display = 'none';
 }
 
 // Close modals when clicking outside of them
 window.onclick = function(event) {
   if (event.target == addModal) {
     addModal.style.display = 'none';
   }
   if (event.target == editModal) {
     editModal.style.display = 'none';
   }
 }
 
 // TODO: Add form submission logic here for editing the product