const { model } = require('mongoose')
module.exports = (joi, mongoose) => {
  const pingSchema = mongoose.Schema({
    uid: { type: String, trim: true, unique: true, index: true },
    lastPing: { type: Number }
  })
  return mongoose.model('ping', pingSchema)
}
