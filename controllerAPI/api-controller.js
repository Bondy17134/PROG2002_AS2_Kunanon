var express = require("express");
var router = express.Router();
var connection = require("../event_db");

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
    var date = req.query.date;
    var location = req.query.location;

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

    var value = [];

    if(search){
        sql += `
            AND (
                e.title LIKE ?
                OR e.description LIKE ?
                OR e.location LIKE ?
                OR ch.name LIKE ?
            )
        `

        var searchValue = `%${search}%`;

        value.push(searchValue, searchValue, searchValue, searchValue);
    }

    if(date){
        var validDate = /^\d{4}-\d{2}-\d{2}$/.test(date);

        if(!validDate){
            return res.status(400).send({
                error: "Date must use YYYY-MM-DD format"
            });
        }

        sql += " AND DATE(e.event_date) = ?";
        value.push(date);
    }

    if(location){
        sql += " AND e.location LIKE ?";
        value.push(`%${location}%`);
    }

    if(category){
        if(isNaN(category)){
            return res.status(400).send({
                error: "Category must be a number"
            });
        }
        sql += " AND e.category_id = ?";
        value.push(category);
    }

    sql += " ORDER BY e.event_date ASC";

    connection.query(sql, value, (err, records) => {
        if (err) {
            console.error("Error while retrieving events:", err);
            return res.status(500).send({
                error: "Unable to retrieve events"
            });
        }
        res.status(200).send(records);
    });
});

/*
    GET /api/events/:id

    Returns detailed information for one event.    
*/
router.get("/:id", (req, res) => {
    var eventId = req.params.id;

    if(isNaN(eventId)){
        return res.status(400).send({
            error: "Event ID must be a number"
        });
    }

    var sql = `
        SELECT
            e.event_id,
            e.title,
            e.description,
            e.event_date,
            e.location,
            e.capacity,
            c.category_id,
            c.name AS category,
            ch.charity_id,
            ch.name AS charity,
            ch.description AS charity_description,
            ch.contact_email,
            ch.website,
            CONCAT(u.first_name, ' ', u.last_name) AS organiser
        FROM events e
        JOIN categories c
            ON e.category_id = c.category_id
        JOIN charities ch
            ON e.charity_id = ch.charity_id
        JOIN users u
            ON e.organiser_id = u.user_id
        WHERE e.event_id = ?
    `;

    connection.query(sql, [eventId], (err, records) => {
        if(err) {
            console.error("Error retrieving event:", err);

            return res.status(500).send({
                error: "Unable to retrieve event"
            });
        }

        if(records.length === 0){
            return res.status(404).send({
                error: "Event not found"
            });
        }
        res.status(200).send(records[0]);
    });
});

module.exports = router;