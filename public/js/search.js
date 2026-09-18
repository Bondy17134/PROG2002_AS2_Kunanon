var searchForm = document.getElementById("search-form");
var dateInput = document.getElementById("event-date");
var locationInput = document.getElementById("event-location");
var categorySelect = document.getElementById("event-category");
var clearButton = document.getElementById("clear-filters");
var searchResults = document.getElementById("search-results");
var searchMessage = document.getElementById("search-message");

/*
    Retrieve categories from the API and add them 
    to the category dropdown.
*/
function loadCategories() {
    fetch("/api/categories")
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

/*
    Build the API URL using the selected filters.
*/
function searchEvents() {
    var parameters = new URLSearchParams();

    var selectedDate = dateInput.value;
    var selectedLocation = locationInput.value.trim();
    var selectedCategory = categorySelect.value;

    if(selectedDate) {
        parameters.append("date", selectedDate);
    }

    if(selectedLocation) {
        parameters.append("location", selectedLocation);
    }

    if(selectedCategory) {
        parameters.append("category", selectedCategory);
    }

    var apiUrl = "/api/events";

    if(parameters.toString()) {
        apiUrl += `?${parameters.toString()}`;
    }

    searchMessage.textContent = "Searching for events...";
    searchMessage.classList.remove("error-message");
    searchResults.innerHTML = "";

    fetch(apiUrl)
        .then((response) => {
            if(!response.ok){
                return response.json().then((data) => {
                    throw new Error(
                        data.error || "Unable to retrieve events."
                    );
                });
            }
            return response.json();
        })
        .then((events) => {
            displayEvents(events);
        })
        .catch((error) => {
            console.error("Search error:", error);
            showError(error.message);
        });
}

/*
    Display the event results using DOM manipulation.
*/
function displayEvents(events){
    searchResults.innerHTML = "";

    if(events.length === 0) {
        searchMessage.textContent = "No events matched your selected filters.";
        return;
    }

    searchMessage.textContent = 
        `${events.length} matching event${events.length === 1 ? "" : "s"} found`;

    events.forEach((event) => {
        var card = createEventCard(event);
        searchResults.appendChild(card);
    });
}

function createEventCard(event){
    var card = document.createElement("article");
    card.className = "event-card";

    var visual = document.createElement("div");
    visual.className = "event-card-visual";

    var category = document.createElement("span");
    category.className = "category-badge";
    category.textContent = event.category;

    var content = document.createElement("div");
    content.className = "event-card-content";
    
    var title = document.createElement("h3");
    title.textContent = event.title;

    var date = document.createElement("p");
    date.className = "event-meta";
    date.textContent = `Date: ${formatDate(event.event_date)}`;

    var location = document.createElement("p");
    location.className = "event-meta";
    location.textContent = `Location: ${event.location}`;
    
    var charity = document.createElement("p");
    charity.className = "event-meta";
    charity.textContent = `Organised by ${event.charity}`;

    var link = document.createElement("a");
    link.className = "event-link";
    link.href = `/event?id=${encodeURIComponent(event.event_id)}`;

    content.appendChild(title);
    content.appendChild(date);
    content.appendChild(location);
    content.appendChild(charity);
    content.appendChild(link);

    card.appendChild(visual);
    card.appendChild(content);

    return card;
}

function formatDate(dateValue){
    var date = new Date(dateValue);

    return date.toLocaleDateString("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function showError(message){
    searchResults.innerHTML = "";
    searchMessage.textContent = message;
    searchMessage.classList.add("error-message");
}

/*
    Submit the form and call the API
*/
searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    searchEvents();
});

/*
    Reset all inputs using basic DOM
*/
clearButton.addEventListener("click", () => {
    searchForm.reset();
    searchEvents();
    locationInput.focus();
});

loadCategories();
searchEvents();