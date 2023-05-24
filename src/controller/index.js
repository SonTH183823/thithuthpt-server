module.exports = (container) => {
  const userController = require('./userController')(container)
  const newsController = require('./newsController')(container)
  const categoryController = require('./categoryController')(container)
  const tagController = require('./tagController')(container)
  return { userController, newsController, categoryController, tagController }
}
