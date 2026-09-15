var express = require("express");
var router = express.Router();
var connection = require()("../event_db");

router.get("/", (req, res) => {
    var sql = `
        SELECT
            e.event_id,
            e.title,
            e.description,
            e.event_date,
            e.location,
            e.capacity,
            c.name AS category,
            ch.name AS charity,
            CONCAT(u.first_name, ' ', u.last_name) AS organiser
        FROM events e
        JOIN categories c
            ON e.category_id = c.category_id
        JOIN charities ch
            ON e.charity_id = ch.charity_id
        JOIN users u
            ON e.organiser_id = u.user_id
        ORDER BY e.event_date
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