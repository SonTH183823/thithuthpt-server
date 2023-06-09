module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { basePathCMS } = serverSettings
  const { newsController } = container.resolve('controller')
  const { verifyTokenCMS } = container.resolve('middleware')

  app.get(`${basePathCMS}/news`, verifyTokenCMS, newsController.getListNews)
  app.get(`${basePathCMS}/news/:id`, verifyTokenCMS, newsController.getNewsById)
  app.post(`${basePathCMS}/news`, verifyTokenCMS, newsController.createNews)
  app.put(`${basePathCMS}/news/:id`, verifyTokenCMS, newsController.updateNewsById)
  app.delete(`${basePathCMS}/news/:id`, verifyTokenCMS, newsController.removeNewsById)
}
