var express = require('express');
var bodyParser = require('body-parser');
var path = require("path");

var app = express();
var port = 3060;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var eventAPI = require("./controllerAPI/api-controller");
var categoryAPI = require("./controllerAPI/category-controller");

app.use("/api/events", eventAPI);
app.use("/api/categories", categoryAPI);

// Serve CSS, JavaScript and images from the public folder
app.use(express.static(path.join(__dirname, "public")));

// Website page routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/search", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "search.html"));
});

app.get("/event", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "event.html"));
});

app.listen(port, () => {
    console.log(`Server up and running on port ${port}`);
});