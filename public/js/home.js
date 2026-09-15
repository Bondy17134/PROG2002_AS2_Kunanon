var eventGrid = document.getElementById("events-grid");
var eventMessage = document.getElementById("event-message");

fetch("/api/events")
    .then(response) => {
        if(!response.ok){
            throw new error("The server could not return the events.");
        }
    }