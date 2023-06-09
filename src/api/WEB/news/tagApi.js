module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { basePath } = serverSettings
  const { tagController } = container.resolve('controller')
  const { verifyToken } = container.resolve('middleware')
  app.use(verifyToken)
  app.get(`${basePath}/tagNews`, tagController.getListTagNews)
  app.get(`${basePath}/tagNews/:id`, tagController.getTagNewsById)
}
