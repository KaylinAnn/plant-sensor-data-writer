module.exports = {
  addMoisture: (req, res) => {
    const db = req.app.get('db')
    // replace with req.session for plant id
    db.add_moisture([req.body.moisture, 1])
      .then(() => {
        res.status(200).send()
      })
      .catch(err => {
        console.log('error', err)
        res.status(500).send('error')
      })
  },

  addTemp: (req, res) => {
    const db = req.app.get('db')
    // replace with req.session for plant id
    db.add_temp([req.body.temp, 1])
      .then(() => {
        res.status(200).send()
      })
      .catch(err => {
        console.log('error', err)
        res.status(500).send('error')
      })
  }
}