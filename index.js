const express = require('express');
const bodyParser = require('body-parser');
const massive = require('massive')
const sensor = require('i2c-seesaw-moisture-sensor')
require("dotenv").config();
const controller = require('./controller')

const app = express();

app.use(bodyParser.json());

let client = sensor.open(0x36)

client.getTemperature()
  .then((temp) => {
    let tempF = Math.round((temp * 9 / 5) + 32)
    console.log(tempF);
  })
  .then(() => {
    return client.getMoisture()
  })
  .then(console.log)



massive(process.env.CONNECTION_STRING)
  .then(database => {
    app.set("db", database);
    console.log("database is kickin");
  })
  .catch(error => {
    console.log("-------------- database issue", error);
  });

app.get('/api/plantmoisture', controller.addMoisture)
app.get('/api/planttemp', controller.addTemp)

const PORT = 4001;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));