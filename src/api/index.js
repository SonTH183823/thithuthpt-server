module.exports = (app, container) => {
  require('./user/userApi')(app, container)
  require('./news/newsApi')(app, container)
  require('./news/categoryApi')(app, container)
  require('./news/tagApi')(app, container)
  require('./userCMS/userCMSApi')(app, container)
}
