const Massive = require('massive')
const sensor = require('i2c-seesaw-moisture-sensor')
require("dotenv").config();


let db
function run() {

  db.run("select * from plants", function (err, results) {
    if (err != null) {
      console.log(err)
    }
    return Promise.all(
      results.map(result => {
        let device = parseInt(result.device, 16)
        let client = sensor.open(device)
        return client.getTemperature()
          .then((temp) => {
            let tempF = Math.round((temp * 9 / 5) + 32)
            console.log(tempF);
            db.add_temp([tempF, result.id], function (err, res) {
              console.log(err);
            })
          })
          .then(() => {
            return client.getMoisture()
          })
          .then(console.log)
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