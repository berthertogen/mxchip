const mongoose = require('mongoose');

const IotEventSchema = mongoose.Schema({
    enqueued_time: Date,
    temperature: Number,
    humidity: Number
}, {
    timestamps: true
});

module.exports = mongoose.model('events', IotEventSchema);
