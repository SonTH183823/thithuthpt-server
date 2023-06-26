const config = require('./config')
const IDatabaseResult = require('./response')
const notification = require('./notification')
module.exports = { ...config, IDatabaseResult, notification }
