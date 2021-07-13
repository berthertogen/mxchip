const Events = require('../models/event.model.js');

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    Events.find().sort({enqueued_time: -1}).limit(parseInt(req.params.minutes))
    .then(events => {
        res.send(events);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving events."
        });
    });

};
