module.exports = (app) => {
    const iotEvents = require('./iot-event.controller.js');

    app.get('/iot-events/:limit', iotEvents.findAll);
    app.get('/iot-events/:from-:till/:minutes', iotEvents.findRangeAndAggregate);
    app.get('/iot-events', iotEvents.create);
}
