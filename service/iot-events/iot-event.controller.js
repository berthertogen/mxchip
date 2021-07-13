const IotEvents = require('./iot-event.model.js');

exports.findAll = (req, res) => {
    const limit = parseInt(req.params.limit);
    IotEvents.find().sort({enqueued_time: -1}).limit(limit)
    .then(events => {
        res.send(events);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving iot-events."
        });
    });

};
