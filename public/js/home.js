var eventGrid = document.getElementById("events-grid");
var eventMessage = document.getElementById("event-message");

fetch("/api/events")
    .then((response) => {
        if(!response.ok){
            throw new error("The server could not return the events.");
        }
        return response.json();
    })
    .then((events) => {
        eventGrid.innerHTML = "";

        if(events.length === 0) {
            eventMessage.textContent = "There are currently no upcoming events.";
            return;
        }

        eventMessage.textContent = `${events.length} upcoming events found.`;

        events.forEach((event) => {
            var card = createEventCard(event);
            eventGrid.appendChild(card);
        });
    })
    .catch((error) => {
        console.error("Error fetching events:", error);
        eventMessage.textContent = "We could not load the upcoming events. Please try again later.";
        eventMessage.classList.add("error-message");
    });

function createEventCard(event){
    var card = document.createElement("article");
    card.className = "event-card";

    var visual = document.createElement("div");
    visual.className = "event-card-visual";

    var category = document.createElement("span");
    category.className = "catgory-badge";
    category.textContent = event.category;

    visual.appendChild(category);

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
    charity.textContent = `Organised by: ${event.charity}`;

    var link = document.createElement("a");
    link.className = "event-link";
    link.href = `/event?id=${encodeURIComponent(event.event_id)}`;
    link.textContent = "View event ->";

    content.appendChild(title);
    content.appendChild(date);
    content.appendChild(location);
    content.appendChild(charity);
    content.appendChild(link);

    card.appendChild(visual);
    card.appendChild(content);

    return card;

function formatDate(dateValue) {
    var date = new Date(dateValue);

    return date.toLocaleDateString("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}
}