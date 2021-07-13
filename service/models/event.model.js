const mongoose = require('mongoose');

const EventsSchema = mongoose.Schema({
    enqueued_time: Date,
    offset: String,
    sequence_number: Number,
}, {
    timestamps: true
});

module.exports = mongoose.model('events', EventsSchema);
