const Massive = require('massive')
const sensor = require('i2c-seesaw-moisture-sensor')
require("dotenv").config();


let db
function run() {
  db.get_all_plants()
    .then(function (results) {
      return Promise.all(
        results.map(result => {
          let device = parseInt(result.device, 16)
          let client = sensor.open(device)
          return client.getTemperature()
            .then((temp) => {
              let tempF = Math.round((temp * 9 / 5) + 32)
              return db.add_temp([tempF, result.id])
            })
            .then(() => {
              return client.getMoisture()
            })
            .then((moisture) => {
              return db.add_moisture([moisture, result.id])
            })
        })
      )
        .then(() => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve()
            }, 30000)
          })
        })
        .then(() => {
          return run()
        })
        .catch(err => {
          console.log(err);
        })
    })
}

function main() {
  Massive(process.env.CONNECTION_STRING)
    .then((database) => {
      db = database
    })
    .then(() => {
      run()
    })
    .catch(err => {
      console.log(err);
    })
}

main()