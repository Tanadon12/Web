var form = document.querySelector('form');
var searchInput = document.getElementById('searchbyname');

if (!form || !searchInput) {
    console.error('One or more elements are missing.');
} 
else {
    form.addEventListener('submit', function(event) {
        event.preventDefault();  // Prevent the default form submission
        var searchData = searchInput.value;
        console.log('Submitting search:', searchData); // Log the search data for debugging
        window.location.href = '/SearchRes/' + encodeURIComponent(searchData); // open search result page
    });

   
}