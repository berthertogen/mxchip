module.exports = (app) => {
    const iotEvents = require('./iot-event.controller.js');

    app.get('/iot-events/:limit', iotEvents.findAll);
    app.post('/iot-events', iotEvents.create);
}
