module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { basePath } = serverSettings
  const { tagController } = container.resolve('controller')

  app.get(`${basePath}/tagNews`, tagController.getListTagNews)
  app.get(`${basePath}/tagNews/:id`, tagController.getTagNewsById)
  app.post(`${basePath}/tagNews`, tagController.createTag)
  app.put(`${basePath}/tagNews/:id`, tagController.updateTagById)
  app.delete(`${basePath}/tagNews/:id`, tagController.removeTagById)
}
