var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var port = 3060;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var apiController = require("./controllerAPI/api-controller");

app.use("/api", apiController);

app.listen(port, () => {
    console.log(`Server up and running on port ${port}`);
});