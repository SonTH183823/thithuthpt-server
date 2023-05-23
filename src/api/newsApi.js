module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { basePath } = serverSettings
  const { newsController } = container.resolve('controller')

  app.get(`${basePath}/news`, newsController.getListNews)
  app.get(`${basePath}/news/:id`, newsController.getNewsById)
  app.post(`${basePath}/news`, newsController.createNews)
  app.put(`${basePath}/news/:id`, newsController.updateNewsById)
  app.delete(`${basePath}/news/:id`, newsController.removeNewsById)
}
