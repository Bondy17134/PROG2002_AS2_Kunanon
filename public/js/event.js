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
    
}