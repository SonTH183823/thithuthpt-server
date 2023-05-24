module.exports = (app, container) => {
  require('./userApi')(app, container)
  require('./newsApi')(app, container)
  require('./categoryApi')(app, container)
  require('./tagApi')(app, container)
}
