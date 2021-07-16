const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
require('dotenv').config()

const app = express();
const corsOrigins = process.env.CORSORIGIN.split(',');
app.use(cors({ origin: function (origin, callback) {
    if (corsOrigins.indexOf(origin) !== -1 || origin.startsWith("192.168.1.")) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
 }))
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

require('./iot-events/iot-event.routes.js')(app);

app.get('/', (req, res) => {
    return res.send("Hello world")
});

app.listen(process.env.PORT, function () {
    console.log(`listening on ${process.env.PORT}`)
})
