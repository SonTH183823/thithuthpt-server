module.exports = (app, container) => {
  require('./sdpApi')(app, container)
  // app.use(verifyCMSToken)
  require('./newsApi')(app, container)
  require('./categoryApi')(app, container)
  require('./tagApi')(app, container)
}
