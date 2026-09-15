var express = require("express");
var router = express.Router();
var connection = require("../event_db");

/*
    GET /api/categories

    Returns all event categories for the search filther.   
*/
router.get("/", (req, res) => {
    var sql = `
        SELECT
            category_id,
            name,
            description
        FROM categories
        ORDER BY name ASC
    `;

    connection.query(sql, (err, records) => {
        if(err) {
            console.error("Error retrieving categories: ", err);

            return res.status(500).send({
                error: "Unable to retrieve categories"
            });
        }

        res.status(200).send(records);
    });
});

module.exports = router;