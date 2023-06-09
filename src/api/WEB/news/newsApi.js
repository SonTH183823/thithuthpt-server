module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { basePath } = serverSettings
  const { newsController } = container.resolve('controller')
  const { verifyToken } = container.resolve('middleware')
  app.use(verifyToken)
  app.get(`${basePath}/news`, newsController.getListNews)
  app.get(`${basePath}/news/:id`, newsController.getNewsById)
}
