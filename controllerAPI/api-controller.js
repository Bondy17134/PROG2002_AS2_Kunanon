var express = require("express");
var router = express.Router();
var connection = require()("../event_db");

/*
    GET /api/events

    Returns current and upcoming events.
    Optional query parameters:
        search - search title, description, location and charity
        category - filter by category_id
    
    Example:
        /api/event?search=run
        /api/search?category=1
        /api/search?search=run&category=1    
*/
router.get("/", (req, res) => {
    var search = req.query.search;
    var category = req.query.category;

    var sql = `
        SELECT
            e.event_id,
            e.title,
            e.description,
            e.event_date,
            e.location,
            e.capacity,
            e.category_id,
            c.name AS category,
            ch.charity_id,
            ch.name AS charity
        FROM events e
        JOIN categories c
            ON e.category_id = c.category_id
        JOIN charities ch
            ON e.charity_id = ch.charity_id
        WHERE e.event_date >= NOW()
    `;

    connection.query(sql, (err, records, fields) => {
        if (err) {
            console.error("Error while retrieving events:", err);
            return res.status(500).send({
                error: "Unable to retrieve events"
            });
        }
        res.send(records);
    });
})

module.exports = router;