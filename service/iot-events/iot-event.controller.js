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
  const from = DateTime.fromFormat(req.params.from, "yyyyMMdd");
  const till = DateTime.fromFormat(req.params.till, "yyyyMMdd");
  const minutes = parseInt(req.params.minutes);
  IotEvents
    .aggregate([
      {
        "$match": {
          "createdAt": {
            "$gte": from.toJSDate(),
            "$lte": till.toJSDate()
          }
        }
      },
      {
        "$group": {
          "_id": {
            "$toDate": {
              "$subtract": [
                { "$toLong": "$createdAt" },
                { "$mod": [{ "$toLong": "$createdAt" }, 1000 * 60 * minutes] }
              ]
            }
          },
          "count": {
            "$sum": 1
          },
          "averageTemperature": {
            "$avg": "$temperature"
          },
          "averageHumidity": {
            "$avg": "$humidity"
          }
        }
      },
      {
        "$project": {
          "aggregatedOn" : "$_id", 
          "count": "$count",
          "temperature": "$averageTemperature",
          "humidity": "$averageHumidity"
        }
      },
      {
        "$sort": {
          "aggregatedOn": 1,
        }
      }
    ])
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
