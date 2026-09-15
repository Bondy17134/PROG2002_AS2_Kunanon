var searchForm = document.getElementById("searchForm");
var dateInput = document.getElementById("event-date");
var locationInput = document.getElementById("event-location");
var categorySelect = document.getElementById("event-category");
var clearButton = document.getElementById("clear-filter");
var searchResults = document.getElementById("search-results");
var searchMessage = document.getElementById("search-message");

/*
    Retrieve categories from the API and add them 
    to the category dropdown.
*/
function loadCategories() {
    fetch("/api/catgories")
        .then((response) => {
            if(!response.ok){
                throw new Error("Unable to retrieve categories.");
            }
            return response.json();
        })
        .then((categories) => {
            categories.forEach((category) => {
                var option = document.createElement("option");

                option.value = category.category_id;
                option.textContent = category.name;

                categorySelect.appendChild(option);
            });
        })
        .catch((error) => {
            console.error("Error fetching categories:", error);

            showError(
                "Categories could not be loaded. Other filters are still available."
            );
        });
}