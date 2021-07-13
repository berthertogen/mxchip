module.exports = (app) => {
    const events = require('../controllers/events.controller.js');

    // Retrieve all Notes
    app.get('/events/:minutes', events.findAll);
}
