var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var port = 3060;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var eventAPI = require("./controllerAPI/api-controller");
var categoryAPI = require("./controllerAPI/category-controller");

app.use("/api/events", eventAPI);
app.use("/api/categories", categoryAPI);

app.listen(port, () => {
    console.log(`Server up and running on port ${port}`);
});