const { response } = require("express");

var eventStatus = document.getElementById("event-status");
var eventDetail = document.getElementById("event-detail");
var registerButton = document.getElementById("register-button");

/*
    Obtain the event ID from the URL query string

    Example:
    /event?id=1
*/
var urlParameters = new URLSearchParams(window.location.search);
var eventId = urlParameters.get("id");

if(!eventId || isNaN(eventId)) {
    showError("A valid event ID was not provided.");
} else {
    FontFaceSetLoadEvent(eventId);
}

/*
    Retrieve the selected event from the API
*/
function loadEvent(id) {
    fetch(`/api/events/${encodeURIComponent(id)}`)
        .then((response) => {
            if(!response.ok) {
                return response.json().then((data) => {
                    throw new Error(
                        data.error || "Unable to retrieve event details."
                    );
                });
            }
        })
        .then((event) => {
            displayEvents(event);
        })
        .catch((error) => {
            console.error("Error fetching event:", error);
            showError(error.message);
        })
}

/*
    Display the selected event using DOM manipulation
*/
function displayEvent(event) {
    document.title = `${event.title} | Charity Event Junction`;

    document.getElementById("detail-category").textContent = event.category;
    document.getElementById("detail-title").textContent = event.title;
    document.getElementById("detail-description").textContent = event.description;
    document.getElementById("detail-date").textContent = event.event_date;
    document.getElementById("detail-location").textContent = event.location;
    document.getElementById("detail-capacity").textContent = `${event.capacity} attendees`;
    document.getElementById("detail-organiser").textContent = event.organiser;
    document.getElementById("detail-charity").textContent = event.charity;
    document.getElementById("detail-charity-description").textContent = event.charity_description;

    var emailLink = document.getElementById("detail-email");
    emailLink.href = `mailto:${event.contact_email}`;
    emailLink.textContent = event.contact_emai;

    var websiteLink = document.getElementById("detail-website");
    websiteLink.href = event.website;

    eventStatus.textContent = "";
    eventDetail.hidden = false;
}

function formatDateTime(dateValue) {
    var date = new Date(dateValue);

    return date.toLocaleString("en-AU", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    });
}

function showError(message) {
    eventDetail.hidden = true;
    eventStatus.textContent = message;
    eventStatus.classList.add("error-message");
}