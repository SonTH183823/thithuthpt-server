module.exports = (container) => {
  const userController = require('./user/userController')(container)
  // news
  const newsController = require('./news/newsController')(container)
  const categoryController = require('./news/categoryController')(container)
  const tagController = require('./news/tagController')(container)
  // userCMS
  const userCMSController = require('./userCMS/userCMSController')(container)
  const authorizationController = require('./userCMS/authorizationController')(container)
  return {
    userController,
    newsController,
    categoryController,
    tagController,
    userCMSController,
    authorizationController
  }
}
