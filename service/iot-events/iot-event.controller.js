const { DateTime } = require("luxon");
const IotEvents = require('./iot-event.model.js');

exports.findAll = (req, res) => {
  const limit = parseInt(req.params.limit);
  IotEvents.find().sort({ enqueued_time: -1 }).limit(limit)
    .then(events => {
      res.send(events);
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving iot-events."
      });
    });
};

exports.findRangeAndAggregate = (req, res) => {
  console.log(req.params)
  const from = DateTime.fromFormat(req.params.from, "yyyyMMdd");
  const till = DateTime.fromFormat(req.params.till, "yyyyMMdd");
  const minutes = parseInt(req.params.minutes);

  IotEvents
    .aggregate([
      { "$match": { "enqueued_time": {
        $gte: from.toISO(),
        $lt: till.toISO()
      } } },
      { "$group": {
        "_id": {
          "year": { "$year": "enqueued_time" },
          "dayOfYear": { "$dayOfYear": "enqueued_time" },
          "hour": { "$hour": "enqueued_time" },
          "interval": {
            "$subtract": [ 
              { "$minute": "enqueued_time" },
              { "$mod": [{ "$minute": "enqueued_time"}, 15] }
            ]
          }
        }},
        "count": { "$sum": 1 }
      }
    ])
    .sort({ enqueued_time: -1 })
    .then(events => {
      res.send(events);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving iot-events."
      });
    });
};

exports.create = (req, res) => {
  new IotEvents({
    humidity: req.query.humidity ? parseFloat(req.query.humidity) : 0,
    temperature: req.query.temperature ? parseFloat(req.query.temperature) : 0,
    enqueued_time: new Date()
  })
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Note."
      });
    });
};
